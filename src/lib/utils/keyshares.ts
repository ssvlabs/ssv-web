import { sortNumbers } from "@/lib/utils/number";
import { getOperatorIds, sortOperators } from "@/lib/utils/operator";
import type { Operator } from "@/types/api";
import { type KeySharesItem } from "ssv-keys";
import type { Address } from "viem";
import { getChainName } from "@/lib/utils/wagmi";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { getOSName, isWindows } from "@/lib/utils/os";
export enum KeysharesValidationErrors {
  OPERATOR_NOT_EXIST_ID,
  OPERATOR_NOT_MATCHING_ID,
  VALIDATOR_EXIST_ID,
  ERROR_RESPONSE_ID,
  InvalidFileType,
  DifferentCluster,
  DuplicatedValidatorKeys,
  InconsistentOperatorPublicKeys,
  InconsistentOperators,
}

export const DKG_VERSIONS = {
  OLD: "2.1.0",
  NEW: "3.0.3",
};

export class KeysharesValidationError extends Error {
  constructor(public code: KeysharesValidationErrors) {
    super();
  }
}

export const isKeysharesError = (
  error: unknown,
): error is KeysharesValidationError => {
  return error instanceof KeysharesValidationError;
};

export const validateConsistentOperatorIds = (keyshares: KeySharesItem[]) => {
  const operatorIds = sortNumbers(keyshares[0].payload.operatorIds);

  keyshares.every(({ payload, data }) => {
    const payloadOperatorIds = sortNumbers(payload.operatorIds).toString();
    const dataOperatorIds = getOperatorIds(data.operators ?? []).toString();

    const valid =
      payloadOperatorIds === dataOperatorIds &&
      dataOperatorIds === operatorIds.toString();

    if (!valid) {
      throw new KeysharesValidationError(
        KeysharesValidationErrors.InconsistentOperators,
      );
    }
    return true;
  });

  return operatorIds;
};

export const validateConsistentOperatorPublicKeys = (
  keyshares: KeySharesItem[],
  operators: Pick<Operator, "id" | "public_key">[],
) => {
  const operatorsMap = new Map(operators.map((o) => [o.id, o.public_key]));
  const valid = keyshares.every(({ data }) =>
    data.operators?.every(
      ({ id, operatorKey }) => operatorsMap.get(id) === operatorKey,
    ),
  );

  if (!valid) {
    throw new KeysharesValidationError(
      KeysharesValidationErrors.InconsistentOperatorPublicKeys,
    );
  }

  return valid;
};

export const ensureValidatorsUniqueness = (keyshares: KeySharesItem[]) => {
  const set = new Set(keyshares.map(({ data }) => data.publicKey));
  if (set.size !== keyshares.length) {
    throw new KeysharesValidationError(
      KeysharesValidationErrors.DuplicatedValidatorKeys,
    );
  }
  return true;
};

const cmd = isWindows ? "ssv-keys.exe" : "./ssv-keys-mac";

type GenerateSSVKeysCMDParams = {
  operators: Pick<Operator, "id" | "public_key">[];
  nonce: number;
  account: Address;
};

export const generateSSVKeysCMD = ({
  operators,
  nonce,
  account,
}: GenerateSSVKeysCMDParams) => {
  const sortedOperators = sortOperators(operators);
  const operatorIds = sortedOperators.map((op) => op.id).join(",");
  const operatorPublicKeys = sortedOperators
    .map((op) => op.public_key)
    .join(",");

  return `${cmd} --operator-keys=${operatorPublicKeys} --operator-ids=${operatorIds} --owner-address=${account} --owner-nonce=${nonce}`;
};

type GenerateSSVKeysDockerCMDParams = {
  operators: Pick<Operator, "id" | "public_key" | "dkg_address">[];
  nonce: number;
  account: Address;
  withdrawalAddress: Address;
  chainId?: number;
  validatorsCount?: number;
  os?: ReturnType<typeof getOSName>;
  newOperators?: Pick<Operator, "id" | "public_key" | "dkg_address">[];
  signatures?: string;
  isReshare?: boolean;
  proofsString?: string;
  version?: string;
};

export const generateSSVKeysDockerCMD = ({
  operators,
  nonce,
  account,
  withdrawalAddress,
  chainId = getChainId(config),
  validatorsCount = 1,
  os = getOSName(),
  version = DKG_VERSIONS.NEW,
  newOperators,
  isReshare,
  signatures,
  proofsString,
}: GenerateSSVKeysDockerCMDParams) => {
  const chainName =
    chainId === 1 ? "mainnet" : getChainName(chainId)?.toLowerCase();
  const sortedOperators = sortOperators(operators);
  const operatorIds = sortedOperators.map((op) => op.id).join(",");
  const dynamicFullPath = os === "windows" ? "%cd%" : "$(pwd)";

  const getOperatorsData = (
    operators: Pick<Operator, "id" | "public_key" | "dkg_address">[],
  ) => {
    const jsonOperatorInfo = JSON.stringify(
      sortOperators(operators).map(({ id, public_key, dkg_address }) => ({
        id,
        public_key,
        ip: dkg_address,
      })),
    );

    return os === "windows"
      ? `"${jsonOperatorInfo.replace(/"/g, '\\"')}"`
      : `'${jsonOperatorInfo}'`;
  };

  if (signatures) {
    return `docker pull ssvlabs/ssv-dkg:v${version} && docker run --rm -v ${dynamicFullPath}:/ssv-dkg/data -it "ssvlabs/ssv-dkg:v${version}" ${isReshare ? "reshare" : "resign"} --operatorIDs ${operatorIds} ${
      newOperators?.length
        ? `--newOperatorIDs ${sortOperators(newOperators)
            .map((op) => op.id)
            .join(",")}`
        : ""
    } --withdrawAddress ${withdrawalAddress} --owner ${account} --nonce ${nonce} --network ${chainName} ${proofsString ? `--proofsString '${proofsString}'` : "--proofsFilePath ./data/proofs.json"} --operatorsInfo ${newOperators ? getOperatorsData([...operators, ...newOperators]) : getOperatorsData(operators)} --signatures ${signatures.slice(2)} --outputPath ./data --logLevel info --logFormat json --logLevelFormat capitalColor --logFilePath ./data/debug.log --tlsInsecure`;
  }
  return `docker pull ssvlabs/ssv-dkg:v${version} && docker run --rm -v ${dynamicFullPath}:/${version === DKG_VERSIONS.NEW ? "ssv-dkg/data" : "data"} -it "ssvlabs/ssv-dkg:v${version}" init --owner ${account} --nonce ${nonce} --withdrawAddress ${withdrawalAddress} --operatorIDs ${operatorIds} --operatorsInfo ${getOperatorsData(sortedOperators)} --network ${chainName} --validators ${validatorsCount} ${version === DKG_VERSIONS.OLD ? "--logFilePath /data/debug.log --outputPath /data" : "--logFilePath ./data/debug.log --outputPath ./data --tlsInsecure"}`;
};
