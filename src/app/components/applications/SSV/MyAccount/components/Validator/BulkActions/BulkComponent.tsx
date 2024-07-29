import { useEffect, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { translations } from '~app/common/config';
import ConfirmationStep from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ConfirmationStep';
import ExitFinishPage from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ExitFinishPage';
import NewBulkActions from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/NewBulkActions';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { BULK_FLOWS } from '~app/enums/bulkFlow.enum.ts';
import { BulkValidatorData, IValidator } from '~app/model/validator.model';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getAccountAddress, getIsContractWallet } from '~app/redux/wallet.slice';
import { MAXIMUM_VALIDATOR_COUNT_FLAG } from '~lib/utils/developerHelper';
import { add0x } from '~lib/utils/strings';
import { exitValidators, removeValidators } from '~root/services/validatorContract.service';
import { getSelectedCluster, setExcludedCluster } from '~app/redux/account.slice.ts';
import { BulkActionRouteState } from '~app/Routes';

enum BULK_STEPS {
  BULK_ACTIONS = 'BULK_ACTIONS',
  BULK_CONFIRMATION = 'BULK_CONFIRMATION',
  BULK_EXIT_FINISH = 'BULK_EXIT_FINISH'
}

const BULK_FLOWS_ACTION_TITLE = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_REMOVE_VALIDATORS,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_EXIT_VALIDATORS
};

const MAX_VALIDATORS_COUNT = Number(window.localStorage.getItem(MAXIMUM_VALIDATOR_COUNT_FLAG)) || 100;

const BULK_ACTIONS_TOOLTIP_TITLES = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TOOLTIPS.REMOVE_VALIDATORS(MAX_VALIDATORS_COUNT),
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TOOLTIPS.EXIT_VALIDATORS(MAX_VALIDATORS_COUNT)
};

const BULK_ACTIONS_TOOLTIP_CHECKBOX_TITLES = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TOOLTIPS.REMOVE_VALIDATORS_CHECKBOX(MAX_VALIDATORS_COUNT),
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TOOLTIPS.EXIT_VALIDATORS_CHECKBOX(MAX_VALIDATORS_COUNT)
};

const BULK_FLOWS_CONFIRMATION_DATA = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.REMOVE,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.EXIT
};

const BulkComponent = () => {
  const [selectedValidators, setSelectedValidators] = useState<Record<string, BulkValidatorData>>({});
  const [currentStep, setCurrentStep] = useState(BULK_STEPS.BULK_ACTIONS);
  const navigate = useNavigate();
  const accountAddress = useAppSelector(getAccountAddress);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const cluster = useAppSelector(getSelectedCluster);
  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);

  const location: Location<BulkActionRouteState> = useLocation();
  const { validator, currentBulkFlow } = location.state;

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (validator) {
      setSelectedValidators({
        [add0x(validator.public_key)]: {
          validator,
          isSelected: true
        }
      });
      setCurrentStep(BULK_STEPS.BULK_CONFIRMATION);
    }
  }, []);

  const selectMaxValidatorsCount = (validators: IValidator[], validatorList: Record<string, BulkValidatorData>): Record<string, BulkValidatorData> => {
    const isSelected = Object.values(selectedValidators).every((validator: { validator: IValidator; isSelected: boolean }) => !validator.isSelected);
    validators.forEach((validator: IValidator, index: number) => {
      validatorList[add0x(validator.public_key)] = {
        validator,
        isSelected: isSelected && index < MAX_VALIDATORS_COUNT
      };
    });
    return validatorList;
  };

  const fillSelectedValidators = (validators: IValidator[], selectAll: boolean = false) => {
    if (validators) {
      let validatorList: Record<string, BulkValidatorData> = {};
      if (selectAll) {
        validatorList = selectMaxValidatorsCount(validators, validatorList);
      } else {
        validators.forEach((validator: IValidator) => {
          validatorList[add0x(validator.public_key)] = {
            validator,
            isSelected: selectedValidators[add0x(validator.public_key)]?.isSelected || false
          };
        });
      }
      setSelectedValidators(validatorList);
    }
  };

  const onCheckboxClickHandler = ({ publicKey }: { publicKey: string }) => {
    setSelectedValidators((prevState: any) => {
      prevState[publicKey].isSelected = !prevState[publicKey].isSelected;
      return { ...prevState };
    });
  };

  const backToSingleClusterPage = (validatorsCount?: number) => {
    navigate(validatorsCount === cluster.validatorCount && cluster.isLiquidated ? -2 : -1);
  };

  const nextStep = async () => {
    const selectedValidatorKeys = Object.keys(selectedValidators);
    const selectedValidatorValues = Object.values(selectedValidators);
    let res;
    const selectedValidatorsCount = selectedValidatorValues.filter((validator) => validator.isSelected).length;
    const isBulk = selectedValidatorsCount > 1;
    if (currentStep === BULK_STEPS.BULK_ACTIONS) {
      setCurrentStep(BULK_STEPS.BULK_CONFIRMATION);
    } else if (currentStep === BULK_STEPS.BULK_CONFIRMATION && currentBulkFlow === BULK_FLOWS.BULK_EXIT) {
      setIsLoading(true);
      const validatorIds = isBulk
        ? selectedValidatorKeys.filter((publicKey: string) => selectedValidators[publicKey].isSelected)
        : add0x(selectedValidatorValues.filter((selectedValidator) => selectedValidator.isSelected)[0].validator.public_key);
      res = await exitValidators({
        isContractWallet,
        validatorIds,
        operatorIds: cluster.operators.map((operator: IOperator) => operator.id),
        isBulk,
        dispatch
      });
      if (res && !isContractWallet) {
        setCurrentStep(BULK_STEPS.BULK_EXIT_FINISH);
      }
      setIsLoading(false);
    } else if (currentStep === BULK_STEPS.BULK_EXIT_FINISH) {
      backToSingleClusterPage();
    } else {
      setIsLoading(true);
      if (selectedValidatorsCount === cluster.validatorCount && cluster.isLiquidated) {
        dispatch(setExcludedCluster(cluster));
      }
      const validatorPks = isBulk
        ? selectedValidatorKeys.filter((publicKey: string) => selectedValidators[publicKey].isSelected)
        : add0x(validator?.public_key || selectedValidatorValues.filter((selectedValidator) => selectedValidator.isSelected)[0].validator.public_key);
      res = await removeValidators({
        cluster,
        accountAddress,
        isContractWallet,
        validatorPks,
        operators: cluster.operators ?? [],
        liquidationCollateralPeriod,
        minimumLiquidationCollateral,
        isBulk,
        dispatch
      });
      if (res && !isContractWallet) {
        backToSingleClusterPage(selectedValidatorsCount);
      }
      setIsLoading(false);
    }
  };

  const stepBack = () => setCurrentStep(BULK_STEPS.BULK_ACTIONS);

  if (currentStep === BULK_STEPS.BULK_ACTIONS && !validator) {
    return (
      <NewBulkActions
        nextStep={nextStep}
        tooltipTitle={BULK_ACTIONS_TOOLTIP_TITLES[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
        checkboxTooltipTitle={BULK_ACTIONS_TOOLTIP_CHECKBOX_TITLES[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
        maxValidatorsCount={MAX_VALIDATORS_COUNT}
        title={BULK_FLOWS_ACTION_TITLE[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
        fillSelectedValidators={fillSelectedValidators}
        selectedValidators={selectedValidators}
        onCheckboxClickHandler={onCheckboxClickHandler}
      />
    );
  }

  if (currentStep === BULK_STEPS.BULK_CONFIRMATION) {
    return (
      <ConfirmationStep
        stepBack={!validator ? stepBack : undefined}
        flowData={BULK_FLOWS_CONFIRMATION_DATA[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
        selectedValidators={Object.keys(selectedValidators).filter((publicKey: string) => selectedValidators[publicKey].isSelected)}
        isLoading={isLoading}
        currentBulkFlow={currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE}
        nextStep={nextStep}
      />
    );
  }

  // BULK_STEPS.BULK_EXIT_FINISH === currentStep
  return <ExitFinishPage nextStep={nextStep} selectedValidators={Object.keys(selectedValidators).filter((publicKey: string) => selectedValidators[publicKey].isSelected)} />;
};

export default BulkComponent;
