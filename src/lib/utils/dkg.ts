import type { Operator as OperatorApiType } from "@/types/api.ts";
import type { Address } from "abitype";
import type { Proof as ProofType } from "@/hooks/use-validate-proofs.ts";
import {
  ContainerType,
  ListCompositeType,
  ByteVectorType,
  UintNumberType,
  ByteListType,
} from "@chainsafe/ssz";
export const DEFAULT_AMOUNT = 32000000000;
const NETWORKS = {
  MAINNET: 1,
  HOLESKY: 17000,
  HOODI: 560048,
};
export const FORKS = {
  [NETWORKS.MAINNET]: "0x00000000",
  [NETWORKS.HOLESKY]: "0x01017000",
  [NETWORKS.HOODI]: "0x10000910",
};

export enum ReshareSteps {
  Signature = 1,
  Resign = 2,
  Remove = 3,
  Register = 4,
}

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

import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

const OperatorType = new ContainerType({
  ID: new UintNumberType(8),
  PubKey: new ByteListType(2048),
});

const ResignType = new ContainerType({
  ValidatorPubKey: new ByteVectorType(48),
  Fork: new ByteVectorType(4),
  WithdrawalCredentials: new ByteListType(32),
  Owner: new ByteVectorType(20),
  Nonce: new UintNumberType(8),
  Amount: new UintNumberType(8),
});

const ReshareType = new ContainerType({
  ValidatorPubKey: new ByteVectorType(48),
  OldOperators: new ListCompositeType(OperatorType, 13),
  NewOperators: new ListCompositeType(OperatorType, 13),
  OldT: new UintNumberType(8),
  NewT: new UintNumberType(8),
  Fork: new ByteVectorType(4),
  WithdrawalCredentials: new ByteListType(32),
  Owner: new ByteVectorType(20),
  Nonce: new UintNumberType(8),
  Amount: new UintNumberType(8),
});

const ProofType = new ContainerType({
  ValidatorPubKey: new ByteVectorType(48),
  EncryptedShare: new ByteListType(512),
  SharePubKey: new ByteVectorType(48),
  Owner: new ByteVectorType(20),
});

const SignedProofType = new ContainerType({
  Proof: ProofType,
  Signature: new ByteVectorType(256),
});

const ResignMessageType = new ContainerType({
  Operators: new ListCompositeType(OperatorType, 13),
  Resign: ResignType,
  Proofs: new ListCompositeType(SignedProofType, 13),
});

const ReshareMessageType = new ContainerType({
  Reshare: ReshareType,
  Proofs: new ListCompositeType(SignedProofType, 13),
});

const parseHexToBuffer = (hex: string) =>
  Buffer.from(hex.startsWith("0x") ? hex.slice(2) : hex, "hex");

const serializedResignMessage = (message: {
  messageData: MessageData;
  proofs: ProofType[];
}) =>
  ResignMessageType.serialize({
    Operators: message.messageData.oldOperators.map((op: OperatorApiType) => ({
      ID: Number(op.id),
      PubKey: Buffer.from(op.public_key),
    })),
    Resign: {
      ValidatorPubKey: parseHexToBuffer(message.messageData.publicKey),
      Fork: parseHexToBuffer(message.messageData.chainId).slice(0, 4),
      WithdrawalCredentials: parseHexToBuffer(
        message.messageData.withdrawalCredentials,
      ),
      Owner: parseHexToBuffer(message.messageData.ownerAddress).slice(0, 20),
      Nonce: Number(message.messageData.nonce),
      Amount: Number(message.messageData.amount),
    },
    Proofs: message.proofs.map((proof: ProofType) => ({
      Proof: {
        ValidatorPubKey: parseHexToBuffer(proof.proof.validator),
        EncryptedShare: parseHexToBuffer(proof.proof.encrypted_share),
        SharePubKey: parseHexToBuffer(proof.proof.share_pub),
        Owner: parseHexToBuffer(proof.proof.owner).slice(0, 20),
      },
      Signature: parseHexToBuffer(proof.signature),
    })),
  });

const serializedReshareMessage = (message: {
  messageData: MessageData;
  proofs: ProofType[];
}) => {
  return ReshareMessageType.serialize({
    Reshare: {
      ValidatorPubKey: parseHexToBuffer(message.messageData.publicKey),
      OldOperators: message.messageData.oldOperators.map(
        (op: OperatorApiType) => ({
          ID: Number(op.id),
          PubKey: Buffer.from(op.public_key),
        }),
      ),
      NewOperators: (message.messageData.newOperators || []).map(
        (op: OperatorApiType) => ({
          ID: Number(op.id),
          PubKey: Buffer.from(op.public_key),
        }),
      ),
      OldT: Number(
        message.messageData.oldOperators.length -
          (message.messageData.oldOperators.length - 1) / 3,
      ),
      NewT: Number(
        (message.messageData.newOperators || []).length -
          ((message.messageData.newOperators || []).length - 1) / 3,
      ),
      Fork: parseHexToBuffer(message.messageData.chainId).slice(0, 4),
      WithdrawalCredentials: parseHexToBuffer(
        message.messageData.withdrawalCredentials,
      ),
      Owner: parseHexToBuffer(message.messageData.ownerAddress).slice(0, 20),
      Nonce: Number(message.messageData.nonce),
      Amount: Number(message.messageData.amount),
    },
    Proofs: message.proofs.map((proof: ProofType) => ({
      Proof: {
        ValidatorPubKey: parseHexToBuffer(proof.proof.validator),
        EncryptedShare: parseHexToBuffer(proof.proof.encrypted_share),
        SharePubKey: parseHexToBuffer(proof.proof.share_pub),
        Owner: parseHexToBuffer(proof.proof.owner).slice(0, 20),
      },
      Signature: parseHexToBuffer(proof.signature),
    })),
  });
};

export const getSignaturePayload = (
  data: {
    messageData: MessageData;
    proofs: ProofType[];
  }[],
) => {
  const serializedMessages: Uint8Array[] = data.map(
    (message: { messageData: MessageData; proofs: ProofType[] }) =>
      message.messageData.newOperators
        ? serializedReshareMessage(message)
        : serializedResignMessage(message),
  );

  const concatenatedBytes = Buffer.concat(
    serializedMessages.map((bytes) => Buffer.from(bytes)),
  );
  const hash = keccak256(concatenatedBytes);

  return toHex(hash);
};
