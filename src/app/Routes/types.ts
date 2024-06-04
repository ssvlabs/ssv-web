import { IValidator } from '~app/model/validator.model.ts';
import { BULK_FLOWS } from '~app/enums/bulkFlow.enum.ts';

export interface NewValidatorRouteState {
  newValidatorFundingPeriod?: number;
  newValidatorDepositAmount?: number;
}

export interface BulkActionRouteState {
  validator?: IValidator;
  currentBulkFlow?: BULK_FLOWS;
}
