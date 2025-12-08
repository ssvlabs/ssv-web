export enum BeaconChainStatus {
  EMPTY = "",
  PENDING_INITIALIZED = "pending_initialized",
  PENDING_QUEUED = "pending_queued",
  ACTIVE_ONGOING = "active_ongoing",
  ACTIVE_EXITING = "active_exiting",
  ACTIVE_SLASHED = "active_slashed",
  EXITED_UNSLASHED = "exited_unslashed",
  EXITED_SLASHED = "exited_slashed",
  WITHDRAWAL_POSSIBLE = "withdrawal_possible",
  WITHDRAWAL_DONE = "withdrawal_done",
}

export enum ValidatorStatus {
  NOT_DEPOSITED = "Not Deposited",
  PENDING = "Pending",
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  EXITING = "Exiting",
  SLASHED = "Slashed",
  EXITED = "Exited",
  INVALID = "Invalid",
}

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
    return ValidatorStatus.INVALID;
  }
  switch (beaconStatus) {
    case BeaconChainStatus.EMPTY:
    case null:
    case undefined:
      return ValidatorStatus.NOT_DEPOSITED;

    case BeaconChainStatus.PENDING_INITIALIZED:
    case BeaconChainStatus.PENDING_QUEUED:
      return ValidatorStatus.PENDING;

    case BeaconChainStatus.ACTIVE_ONGOING:
      return validatorStatus === "Active"
        ? ValidatorStatus.ACTIVE
        : ValidatorStatus.INACTIVE;

    case BeaconChainStatus.ACTIVE_EXITING:
      return ValidatorStatus.EXITING;

    case BeaconChainStatus.ACTIVE_SLASHED:
      return ValidatorStatus.SLASHED;

    case BeaconChainStatus.EXITED_UNSLASHED:
    case BeaconChainStatus.WITHDRAWAL_POSSIBLE:
    case BeaconChainStatus.WITHDRAWAL_DONE:
      return ValidatorStatus.EXITED;

    case BeaconChainStatus.EXITED_SLASHED:
      return ValidatorStatus.SLASHED;

    default:
      console.warn(`Unknown beacon chain status`);
      return ValidatorStatus.ACTIVE;
  }
};
