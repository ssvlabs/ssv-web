import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import NewBulkActions from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/NewBulkActions';
import ExitFinishPage from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ExitFinishPage';
import ConfirmationStep
  from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ConfirmationStep';
import { ProcessStore, ValidatorStore } from '~app/common/stores/applications/SsvWeb';
import { BulkValidatorData, IValidator } from '~app/model/validator.model';
import { IOperator } from '~app/model/operator.model';
import { formatValidatorPublicKey } from '~lib/utils/strings';
import { MAXIMUM_VALIDATOR_COUNT_FLAG } from '~lib/utils/developerHelper';
import { SingleCluster, BULK_FLOWS } from '~app/model/processes.model';
import { setIsLoading } from '~app/redux/appState.slice';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress, getIsContractWallet } from '~app/redux/wallet.slice';

enum BULK_STEPS {
  BULK_ACTIONS = 'BULK_ACTIONS',
  BULK_CONFIRMATION = 'BULK_CONFIRMATION',
  BULK_EXIT_FINISH = 'BULK_EXIT_FINISH',
}

const BULK_FLOWS_ACTION_TITLE = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_REMOVE_VALIDATORS,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_EXIT_VALIDATORS,
};

const MAX_VALIDATORS_COUNT = Number(window.localStorage.getItem(MAXIMUM_VALIDATOR_COUNT_FLAG)) || 100;

const BULK_ACTIONS_TOOLTIP_TITLES = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TOOLTIPS.REMOVE_VALIDATORS(MAX_VALIDATORS_COUNT),
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TOOLTIPS.EXIT_VALIDATORS(MAX_VALIDATORS_COUNT),
};

const BULK_ACTIONS_TOOLTIP_CHECKBOX_TITLES = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TOOLTIPS.REMOVE_VALIDATORS_CHECKBOX(MAX_VALIDATORS_COUNT),
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TOOLTIPS.EXIT_VALIDATORS_CHECKBOX(MAX_VALIDATORS_COUNT),
};

const BULK_FLOWS_CONFIRMATION_DATA = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.REMOVE,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.EXIT,
};

const BulkComponent = () => {
  const [selectedValidators, setSelectedValidators] = useState<Record<string, BulkValidatorData>>({});
  const [currentStep, setCurrentStep] = useState(BULK_STEPS.BULK_ACTIONS);
  const navigate = useNavigate();
  const accountAddress = useAppSelector(getAccountAddress);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const process: SingleCluster = processStore.getProcess;
  const currentBulkFlow = process.currentBulkFlow;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (process.validator) {
      setSelectedValidators({
        [formatValidatorPublicKey(process.validator.public_key)]: {
          validator: process.validator,
          isSelected: true,
        },
      });
      setCurrentStep(BULK_STEPS.BULK_CONFIRMATION);
    }
  }, []);

  const selectMaxValidatorsCount = (validators: IValidator[], validatorList: Record<string, BulkValidatorData>): Record<string, BulkValidatorData> => {
    const isSelected = Object.values(selectedValidators).every((validator: {
      validator: IValidator,
      isSelected: boolean
    }) => !validator.isSelected);
    validators.forEach((validator: IValidator, index: number) => {
      validatorList[formatValidatorPublicKey(validator.public_key)] = {
        validator,
        isSelected: isSelected && index < MAX_VALIDATORS_COUNT,
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
          validatorList[formatValidatorPublicKey(validator.public_key)] = {
            validator,
            isSelected: selectedValidators[formatValidatorPublicKey(validator.public_key)]?.isSelected || false,
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

  const backToSingleClusterPage = () => {
    process.validator = undefined;
    navigate(-1);
  };

  const nextStep = async () => {
    const selectedValidatorKeys = Object.keys(selectedValidators);
    const selectedValidatorValues = Object.values(selectedValidators);
    let res;
    const condition = selectedValidatorValues.filter(validator => validator.isSelected).length > 1;
    if (currentStep === BULK_STEPS.BULK_ACTIONS) {
      setCurrentStep(BULK_STEPS.BULK_CONFIRMATION);
    } else if (currentStep === BULK_STEPS.BULK_CONFIRMATION && currentBulkFlow === BULK_FLOWS.BULK_EXIT) {
      dispatch(setIsLoading(true));
      const singleFormattedPublicKey = formatValidatorPublicKey(selectedValidatorKeys[0]);
      const exitSingle = async () => await validatorStore.exitValidator({ isContractWallet, publicKey: singleFormattedPublicKey, operatorIds: process.item.operators.map((operator: IOperator) => operator.id) });
      const exitBulk = async () => {
        const validatorIds = selectedValidatorKeys.filter((publicKey: string) => selectedValidators[publicKey].isSelected);
        const operatorIds = process.item.operators.map((operator: IOperator) => operator.id);
        await validatorStore.bulkExitValidators({ isContractWallet, validatorIds, operatorIds });
      };
      res = condition ? await exitBulk() : await exitSingle();
      if (res && !isContractWallet) {
        setCurrentStep(BULK_STEPS.BULK_EXIT_FINISH);
      }
    } else if (currentStep === BULK_STEPS.BULK_EXIT_FINISH) {
      backToSingleClusterPage();
    } else {
      dispatch(setIsLoading(true));
      const singleFormattedPublicKey = formatValidatorPublicKey(process?.validator?.public_key || selectedValidatorKeys[0]);
      const singleRemove = async () => await validatorStore.removeValidator({ accountAddress, isContractWallet, publicKey: singleFormattedPublicKey, operators: process.item.operators });
      const bulkRemove = async () => {
        const validatorIds = selectedValidatorKeys.filter((publicKey: string) => selectedValidators[publicKey].isSelected);
        await validatorStore.bulkRemoveValidators({ accountAddress, isContractWallet, validatorIds, operators: process.item.operators });
      };
      res = condition ? await bulkRemove() : await singleRemove();
      if (res && !isContractWallet) {
        backToSingleClusterPage();
      }
    }
  };

  const stepBack = () => setCurrentStep(BULK_STEPS.BULK_ACTIONS);

  if (currentStep === BULK_STEPS.BULK_ACTIONS && !process.validator) {
    return <NewBulkActions nextStep={nextStep}
                           tooltipTitle={BULK_ACTIONS_TOOLTIP_TITLES[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
                           checkboxTooltipTitle={BULK_ACTIONS_TOOLTIP_CHECKBOX_TITLES[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
                           maxValidatorsCount={MAX_VALIDATORS_COUNT}
                           title={BULK_FLOWS_ACTION_TITLE[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
                           fillSelectedValidators={fillSelectedValidators}
                           selectedValidators={selectedValidators}
                           onCheckboxClickHandler={onCheckboxClickHandler}/>;
  }

  if (currentStep === BULK_STEPS.BULK_CONFIRMATION) {
    return <ConfirmationStep stepBack={!process.validator ? stepBack : undefined}
                             flowData={BULK_FLOWS_CONFIRMATION_DATA[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
                             selectedValidators={Object.keys(selectedValidators).filter((publicKey: string) => selectedValidators[publicKey].isSelected)}
                             nextStep={nextStep}/>;
  }

  // BULK_STEPS.BULK_EXIT_FINISH === currentStep
  return <ExitFinishPage nextStep={nextStep} selectedValidators={Object.keys(selectedValidators).filter((publicKey: string) => selectedValidators[publicKey].isSelected)}/>;
};

export default BulkComponent;
