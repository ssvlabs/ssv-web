import { sortNumbers } from "@/lib/utils/number";
import { getOperatorIds, sortOperators } from "@/lib/utils/operator";
import type { Operator } from "@/types/api";
import type { KeySharesItem } from "@ssv-labs/ssv-sdk/keys";
import type { Address } from "viem";
import { getChainName } from "@/lib/utils/wagmi";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { getOSName, isWindows } from "@/lib/utils/os";
import clsx from "clsx";
import { isVersionLTE } from "@/lib/utils/version";
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
  COMPOUNDING_MIN: "3.1.0",
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
  operators: Operator[],
) => {
  const operatorsMap = new Map(operators.map((o) => [o.id, o.public_key]));
  const valid = keyshares.every(({ data }) =>
    data.operators?.every(
      (operator: { id: number; operatorKey: string }) =>
        operatorsMap.get(operator.id) === operator.operatorKey,
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

export const getOperatorsData = (
  operators: Operator[],
  os: ReturnType<typeof getOSName>,
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

type GenerateSSVKeysCMDParams = {
  operators: Operator[];
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

  return clsx([
    cmd,
    `--operator-keys=${operatorPublicKeys}`,
    `--operator-ids=${operatorIds}`,
    `--owner-address=${account}`,
    `--owner-nonce=${nonce}`,
  ]);
};

type GenerateSSVKeysDockerCMDParams = {
  operators: Operator[];
  nonce: number;
  account: Address;
  withdrawalAddress: Address;
  chainId?: number;
  validatorsCount?: number;
  os?: ReturnType<typeof getOSName>;
  newOperators?: Operator[];
  signatures?: string;
  isReshare?: boolean;
  proofsString?: string;
  version?: string;
  compounding?: boolean;
  effectiveBalanceGwei?: bigint;
};

export const generateSSVKeysDockerCMD = ({
  operators,
  nonce,
  account,
  withdrawalAddress,
  chainId = getChainId(config),
  validatorsCount = 1,
  os = getOSName(),
  version = DKG_VERSIONS.COMPOUNDING_MIN,
  newOperators,
  isReshare,
  signatures,
  proofsString,
  compounding = false,
  effectiveBalanceGwei = 0n,
}: GenerateSSVKeysDockerCMDParams) => {
  const chainName =
    chainId === 1 ? "mainnet" : getChainName(chainId)?.toLowerCase();
  const sortedOperators = sortOperators(operators);
  const operatorIds = sortedOperators.map((op) => op.id).join(",");
  const dynamicFullPath = os === "windows" ? "%cd%" : "$(pwd)";

  const compoundingFlags = clsx([
    "--compounding",
    [`--amount ${effectiveBalanceGwei}`],
  ]);

  if (signatures) {
    const newOperatorIds = sortOperators(newOperators || [])
      .map((op) => op.id)
      .join(",");

    const operatorsInfo = newOperators
      ? getOperatorsData([...operators, ...newOperators], os)
      : getOperatorsData(operators, os);

    return clsx([
      `docker pull ssvlabs/ssv-dkg:v${version} &&`,
      `docker run --rm -v ${dynamicFullPath}:/ssv-dkg/data`,
      `-it "ssvlabs/ssv-dkg:v${version}"`,
      isReshare ? "reshare" : "resign",
      `--withdrawAddress ${withdrawalAddress}`,
      `--owner ${account}`,
      `--nonce ${nonce}`,
      `--network ${chainName}`,
      `--operatorIDs ${operatorIds}`,
      `--operatorsInfo ${operatorsInfo}`,
      {
        [`--newOperatorIDs ${newOperatorIds}`]: newOperatorIds,
        [`--proofsString '${proofsString}'`]: proofsString,
        "--proofsFilePath ./data/proofs.json": !proofsString,
        [compoundingFlags]: compounding,
      },
      `--signatures ${signatures.slice(2)}`,
      "--outputPath ./data",
      "--logLevel info",
      "--logFormat json",
      "--logLevelFormat capitalColor",
      "--logFilePath ./data/debug.log",
      "--tlsInsecure",
    ]);
  }

  const isOldVersion = isVersionLTE(version, DKG_VERSIONS.OLD);

  return clsx([
    `docker pull ssvlabs/ssv-dkg:v${version} &&`,
    `docker run --rm -v ${dynamicFullPath}:/${
      isOldVersion ? "data" : "ssv-dkg/data"
    }`,
    `-it "ssvlabs/ssv-dkg:v${version}" init`,
    `--owner ${account}`,
    `--nonce ${nonce}`,
    `--withdrawAddress ${withdrawalAddress}`,
    `--operatorIDs ${operatorIds}`,
    `--operatorsInfo ${getOperatorsData(sortedOperators, os)}`,
    `--network ${chainName}`,
    `--validators ${validatorsCount}`,
    {
      [compoundingFlags]: compounding,
      "--logFilePath /data/debug.log --outputPath /data": isOldVersion,
      "--logFilePath ./data/debug.log --outputPath ./data --tlsInsecure":
        !isOldVersion,
    },
  ]);
};
