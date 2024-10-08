import {
  KeysharesValidationError,
  KeysharesValidationErrors,
} from "@/lib/utils/keyshares";
import type { FC } from "react";

export type KeysharesErrorAlertProps = {
  error?: KeysharesValidationError | Error | null;
};

export const KeysharesErrorAlert: FC<KeysharesErrorAlertProps> = ({
  error,
}) => {
  if (!error) return null;
  const renderMessage = () => {
    if (!(error instanceof KeysharesValidationError)) return error.message;

    switch (error.code) {
      case KeysharesValidationErrors.InvalidFileType:
        return "Invalid file type. Please ensure that the file is a valid keyshares JSON file.";
      case KeysharesValidationErrors.DifferentCluster:
        return "The file contains key shares associated with different clusters. Please ensure that all key shares are consistent with the same operator cluster.";
      case KeysharesValidationErrors.OPERATOR_NOT_EXIST_ID:
        return "One or more operator IDs do not exist.";
      case KeysharesValidationErrors.OPERATOR_NOT_MATCHING_ID:
        return "Operator IDs do not match the selected operators.";
      case KeysharesValidationErrors.VALIDATOR_EXIST_ID:
        return "The validator already exists.";
      case KeysharesValidationErrors.ERROR_RESPONSE_ID:
        return "An error occurred while processing the request.";
      case KeysharesValidationErrors.DuplicatedValidatorKeys:
        return "The file contains duplicated validator public keys. Please ensure that all public keys are unique.";
      case KeysharesValidationErrors.InconsistentOperatorPublicKeys:
        return "Inconsistent operator public keys detected.";
      case KeysharesValidationErrors.InconsistentOperators:
        return "Inconsistent operators detected.";
      default:
        return "An unknown error occurred.";
    }
  };

  return renderMessage();
};
