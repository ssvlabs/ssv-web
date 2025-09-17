// Beacon Chain Status Constants
export const BEACON_CHAIN_STATUS = {
  EMPTY: "" as const,
  PENDING_INITIALIZED: "pending_initialized" as const,
  PENDING_QUEUED: "pending_queued" as const,
  ACTIVE_ONGOING: "active_ongoing" as const,
  ACTIVE_EXITING: "active_exiting" as const,
  ACTIVE_SLASHED: "active_slashed" as const,
  EXITED_UNSLASHED: "exited_unslashed" as const,
  EXITED_SLASHED: "exited_slashed" as const,
  WITHDRAWAL_POSSIBLE: "withdrawal_possible" as const,
  WITHDRAWAL_DONE: "withdrawal_done" as const,
} as const;

// Validator Status Constants
export const VALIDATOR_STATUS = {
  NOT_DEPOSITED: "Not Deposited" as const,
  PENDING: "Pending" as const,
  ACTIVE: "Active" as const,
  INACTIVE: "Inactive" as const,
  EXITING: "Exiting" as const,
  SLASHED: "Slashed" as const,
  EXITED: "Exited" as const,
  INVALID: "Invalid" as const,
} as const;

export type BeaconChainStatus =
  | typeof BEACON_CHAIN_STATUS.EMPTY
  | typeof BEACON_CHAIN_STATUS.PENDING_INITIALIZED
  | typeof BEACON_CHAIN_STATUS.PENDING_QUEUED
  | typeof BEACON_CHAIN_STATUS.ACTIVE_ONGOING
  | typeof BEACON_CHAIN_STATUS.ACTIVE_EXITING
  | typeof BEACON_CHAIN_STATUS.ACTIVE_SLASHED
  | typeof BEACON_CHAIN_STATUS.EXITED_UNSLASHED
  | typeof BEACON_CHAIN_STATUS.EXITED_SLASHED
  | typeof BEACON_CHAIN_STATUS.WITHDRAWAL_POSSIBLE
  | typeof BEACON_CHAIN_STATUS.WITHDRAWAL_DONE;

export type ValidatorStatus =
  | typeof VALIDATOR_STATUS.NOT_DEPOSITED
  | typeof VALIDATOR_STATUS.PENDING
  | typeof VALIDATOR_STATUS.ACTIVE
  | typeof VALIDATOR_STATUS.INACTIVE
  | typeof VALIDATOR_STATUS.EXITING
  | typeof VALIDATOR_STATUS.SLASHED
  | typeof VALIDATOR_STATUS.INVALID
  | typeof VALIDATOR_STATUS.EXITED;

export const mapBeaconChainStatus = ({
  beaconStatus,
  validatorStatus,
  isValid,
}: {
  beaconStatus: BeaconChainStatus;
  validatorStatus: "Active" | "Inactive";
  isValid: boolean;
}): ValidatorStatus => {
  if (!isValid) {
    return VALIDATOR_STATUS.INVALID;
  }
  switch (beaconStatus) {
    case BEACON_CHAIN_STATUS.EMPTY:
    case null:
    case undefined:
      return VALIDATOR_STATUS.NOT_DEPOSITED;

    case BEACON_CHAIN_STATUS.PENDING_INITIALIZED:
    case BEACON_CHAIN_STATUS.PENDING_QUEUED:
      return VALIDATOR_STATUS.PENDING;

    case BEACON_CHAIN_STATUS.ACTIVE_ONGOING:
      return validatorStatus === "Active"
        ? VALIDATOR_STATUS.ACTIVE
        : VALIDATOR_STATUS.INACTIVE;

    case BEACON_CHAIN_STATUS.ACTIVE_EXITING:
      return VALIDATOR_STATUS.EXITING;

    case BEACON_CHAIN_STATUS.ACTIVE_SLASHED:
      return VALIDATOR_STATUS.SLASHED;

    case BEACON_CHAIN_STATUS.EXITED_UNSLASHED:
    case BEACON_CHAIN_STATUS.WITHDRAWAL_POSSIBLE:
    case BEACON_CHAIN_STATUS.WITHDRAWAL_DONE:
      return VALIDATOR_STATUS.EXITED;

    case BEACON_CHAIN_STATUS.EXITED_SLASHED:
      return VALIDATOR_STATUS.SLASHED;

    default:
      console.warn(`Unknown beacon chain status`);
      return VALIDATOR_STATUS.ACTIVE;
  }
};
