import type { Operator as OperatorApiType } from "@/types/api.ts";
import {
  ByteVectorType,
  ContainerType,
  fromHexString,
  ListCompositeType,
  UintBigintType,
} from "@chainsafe/ssz";
import type { Address } from "abitype";
import type { Proof as ProofType } from "@/hooks/use-validate-proofs.ts";
import { keccak256 } from "viem";

export type MessageData = {
  publicKey: string;
  oldOperators: OperatorApiType[];
  newOperators?: OperatorApiType[];
  chainId: string;
  withdrawalCredentials: Address;
  ownerAddress: Address;
  nonce: number;
  amount: number;
};

// operators (8 + 2048) * 4 = 8224
// resign (48 + 4 + 32 + 20 + 8 + 8) = 120
// proof (48 + 512 + 48 + 20) = 628
// signed proof (proof + 256) * 4 = 3536

const base64ToUint8 = (str: string): Uint8Array =>
  Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

const getOperatorsThreshold = (operators: OperatorApiType[]) =>
  operators.length % 3;

const Proof = new ContainerType({
  ValidatorPubKey: new ByteVectorType(48),
  EncryptedShare: new ByteVectorType(512),
  SharePubKey: new ByteVectorType(48),
  Owner: new ByteVectorType(20),
});

const SignedProof = new ContainerType({
  Proof: Proof,
  Signature: new ByteVectorType(256),
});

const Operator = new ContainerType({
  ID: new UintBigintType(8),
  PubKey: new ByteVectorType(2048),
});

const Reshare = new ContainerType({
  ValidatorPubKey: new ByteVectorType(48),
  OldOperators: new ListCompositeType(Operator, 13),
  NewOperators: new ListCompositeType(Operator, 13),
  OldT: new UintBigintType(8),
  NewT: new UintBigintType(8),
  Fork: new ByteVectorType(4),
  WithdrawalCredentials: new ByteVectorType(20),
  Owner: new ByteVectorType(20),
  Nonce: new ByteVectorType(8),
  Amount: new ByteVectorType(8),
});

const Resign = new ContainerType({
  ValidatorPubKey: new ByteVectorType(48),
  Fork: new ByteVectorType(4),
  WithdrawalCredentials: new ByteVectorType(32),
  Owner: new ByteVectorType(20),
  Nonce: new UintBigintType(8),
  Amount: new UintBigintType(8),
});

const ReshareMessage = new ContainerType({
  Reshare: Reshare,
  Proofs: new ListCompositeType(SignedProof, 13),
});

const ResignMessage = new ContainerType({
  Operators: new ListCompositeType(Operator, 13),
  Resign: Resign,
  Proofs: new ListCompositeType(SignedProof, 13),
});

const encodeOperators = (operators: OperatorApiType[]) => {
  return operators.map((op: OperatorApiType) => {
    const sszData = {
      ID: BigInt(op.id),
      PubKey: base64ToUint8(op.public_key),
    };
    return sszData;
  });
};

const encodeProofs = (proofs: ProofType[]) =>
  proofs.map((proof: ProofType) => ({
    Proof: {
      ValidatorPubKey: fromHexString(proof.proof.validator),
      EncryptedShare: fromHexString(proof.proof.encrypted_share),
      SharePubKey: fromHexString(proof.proof.share_pub),
      Owner: fromHexString(proof.proof.owner),
    },
    Signature: fromHexString(proof.signature),
  }));

// TODO: Rename
const encodeResignMessage = ({
  publicKey,
  chainId,
  withdrawalCredentials,
  ownerAddress,
  nonce,
  amount = 32000000000,
}: MessageData) => ({
  ValidatorPubKey: fromHexString(publicKey),
  Fork: fromHexString("0x4268"),
  WithdrawalCredentials: fromHexString(withdrawalCredentials),
  Owner: fromHexString(ownerAddress),
  Nonce: BigInt(nonce),
  Amount: BigInt(amount),
  // Nonce: new Uint8Array(nonce),
  // Amount: new Uint8Array(amount),
});

const encodeReshareMessage = ({
  publicKey,
  oldOperators,
  newOperators,
  chainId,
  withdrawalCredentials,
  ownerAddress,
  nonce,
  amount = 32000000000,
}: MessageData & { newOperators: OperatorApiType[] }) => ({
  ValidatorPubKey: fromHexString(
    publicKey.startsWith("0x") ? publicKey.slice(2) : publicKey,
  ),
  OldOperators: encodeOperators(oldOperators),
  NewOperators: encodeOperators(newOperators),
  OldT: BigInt(getOperatorsThreshold(oldOperators)),
  NewT: BigInt(getOperatorsThreshold(newOperators)),
  Fork: fromHexString(chainId),
  WithdrawalCredentials: fromHexString(withdrawalCredentials),
  Owner: fromHexString(ownerAddress),
  // Nonce: BigInt(nonce),
  // Amount: BigInt(amount),
  Nonce: new Uint8Array(nonce),
  Amount: new Uint8Array(amount),
});

const getEncodeMessage = ({
  messageData,
  proofs,
}: {
  messageData: MessageData;
  proofs: ProofType[];
}) => {
  if (messageData.newOperators) {
    const message = {
      Reshare: encodeReshareMessage(
        messageData as MessageData & { newOperators: OperatorApiType[] },
      ),
      Proofs: encodeProofs(proofs),
    };
    return ReshareMessage.serialize(message);
  } else {
    console.log("1");
    const message = {
      Operators: encodeOperators(messageData.oldOperators),
      Resign: encodeResignMessage(messageData),
      Proofs: encodeProofs(proofs),
    };
    console.log(message);
    return ResignMessage.serialize(message);
  }
};

export const getSignaturePayload = (
  data: {
    messageData: MessageData;
    proofs: ProofType[];
  }[],
) => {
  let msgBytes = new Uint8Array();
  data.forEach((dataItem) => {
    const encodedMessage = getEncodeMessage(dataItem);
    // console.log(encodedMessage);
    // msgBytes.push(...encodedMessage);
    encodeAll(dataItem);
    // console.log(dataItem);
    msgBytes = encodedMessage; // concatenate([msgBytes, encodedMessage]);
  });
  // const msgBytesArray = new Uint8Array(msgBytes);
  // console.log(msgBytes);
  // console.log(msgBytesArray);
  console.log(msgBytes);
  console.log(keccak256(msgBytes));
  // console.log(keccak256(msgBytes));
  return;
};

function concatenate(uint8arrays: Uint8Array[]) {
  // Determine the length of the result.
  const totalLength = uint8arrays.reduce(
    (total, uint8array) => total + uint8array.byteLength,
    0,
  );

  // Allocate the result.
  const result = new Uint8Array(totalLength);

  // Copy each Uint8Array into the result.
  let offset = 0;
  uint8arrays.forEach((uint8array) => {
    result.set(uint8array, offset);
    offset += uint8array.byteLength;
  });

  return result;
}

const encodeAll = (dataItem: {
  messageData: MessageData;
  proofs: ProofType[];
}) => {
  const operators = encodeOperators(dataItem.messageData.oldOperators);
  const messageSsz = encodeResignMessage(dataItem.messageData);
  const proofs = encodeProofs(dataItem.proofs);

  let operatorsSsz = new Uint8Array();
  operators.forEach((dataItem) => {
    console.log(dataItem);
    const encodedMessage = Operator.serialize(dataItem);
    operatorsSsz = concatenate([operatorsSsz, encodedMessage]);
  });

  let proofsSsz = new Uint8Array();
  proofs.forEach((dataItem) => {
    console.log(dataItem);
    const encodedMessage = SignedProof.serialize(dataItem);
    console.log(encodedMessage);
    proofsSsz = concatenate([proofsSsz, encodedMessage]);
  });
  // const msgBytesArray = new Uint8Array(msgBytes);
  // console.log(msgBytes);
  // console.log(msgBytesArray);
  console.log(operatorsSsz);
  console.log(proofsSsz);
  console.log(Resign.serialize(messageSsz));
  console.log(proofsSsz);

  // return ResignMessage.serialize(message);
};
