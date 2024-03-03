import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import { BULK_FLOWS } from '~app/common/stores/applications/SsvWeb/processes/SingleCluster';
import NewBulkActions from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/NewBulkActions';
import ExitFinishPage from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ExitFinishPage';
import ConfirmationStep
  from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ConfirmationStep';
import {
  ProcessStore,
  ValidatorStore,
  SingleCluster as SingleClusterProcess,
} from '~app/common/stores/applications/SsvWeb';
import { BulkValidatorData, IValidator } from '~app/model/validator.model';
import { IOperator } from '~app/model/operator.model';
import { formatValidatorPublicKey } from '~lib/utils/strings';

enum BULK_STEPS {
  BULK_ACTIONS = 'BULK_ACTIONS',
  BULK_CONFIRMATION = 'BULK_CONFIRMATION',
  BULK_EXIT_FINISH = 'BULK_EXIT_FINISH',
}

const BULK_FLOWS_ACTION_TITLE = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_REMOVE_VALIDATORS,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_EXIT_VALIDATORS,
};

const BULK_FLOWS_CONFIRMATION_DATA = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.REMOVE,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.EXIT,
};

const MAX_VALIDATORS_COUNT = 100;

const BulkComponent = () => {
  const [selectedValidators, setSelectedValidators] = useState<Record<string, BulkValidatorData>>({});
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const process: SingleClusterProcess = processStore.getProcess;
  const navigate = useNavigate();
  const currentBulkFlow = process.currentBulkFlow;
  const [currentStep, setCurrentStep] = useState(BULK_STEPS.BULK_ACTIONS);

  useEffect(() => {
    if (process.validator) {
      setSelectedValidators({ [formatValidatorPublicKey(process.validator.public_key)] : { validator: process.validator, isSelected: true } });
      setCurrentStep(BULK_STEPS.BULK_CONFIRMATION);
    }
  }, []);

  const fillSelectedValidators = (validators: IValidator[], selectAll: boolean = false) => {
    if (validators) {
      let validatorList: Record<string, BulkValidatorData> = {};
      const isSelected = selectAll && Object.values(selectedValidators).every((validator: {
        validator: IValidator,
        isSelected: boolean
      }) => !validator.isSelected);
      validators.forEach((validator: IValidator, index: number) => {
        validatorList[formatValidatorPublicKey(validator.public_key)] = {
          validator,
          isSelected: isSelected && index < MAX_VALIDATORS_COUNT,
        };
      });
      setSelectedValidators(validatorList);
    }
  };

  const onCheckboxClickHandler = (isChecked: boolean, publicKey: string) => {
    setSelectedValidators((prevState: any) => {
      prevState[publicKey].isSelected = isChecked && !prevState[publicKey].isSelected;
      return { ...prevState };
    });
  };

  const backToSingleClusterPage = () => {
    process.validator = undefined;
    navigate(-1);
  };

  const nextStep = async () => {
    const selectedValidatorKeys =  Object.keys(selectedValidators);
    const selectedValidatorValues =  Object.values(selectedValidators);
    let res;
    const condition = selectedValidatorValues.filter(validator => validator.isSelected).length > 1;
    if (currentStep === BULK_STEPS.BULK_ACTIONS) {
      setCurrentStep(BULK_STEPS.BULK_CONFIRMATION);
    } else if (currentStep === BULK_STEPS.BULK_CONFIRMATION && currentBulkFlow === BULK_FLOWS.BULK_EXIT) {
      const singleFormattedPublicKey = formatValidatorPublicKey(selectedValidatorKeys[0]);
      const exitSingle = async () => await validatorStore.exitValidator(singleFormattedPublicKey, process.item.operators.map((operator: IOperator) => operator.id));
      const exitBulk = async () => await validatorStore.bulkExitValidators(selectedValidatorKeys.filter((publicKey: string) => selectedValidators[publicKey].isSelected), process.item.operators.map((operator: IOperator) => operator.id));
      res = condition ? await exitBulk() : await exitSingle();
      if (res) {
        setCurrentStep(BULK_STEPS.BULK_EXIT_FINISH);
      }
    } else if (currentStep === BULK_STEPS.BULK_EXIT_FINISH) {
      backToSingleClusterPage();
    } else {
      const singleFormattedPublicKey = formatValidatorPublicKey(process?.validator?.public_key || selectedValidatorKeys[0]);
      const singleRemove = async () => await validatorStore.removeValidator(singleFormattedPublicKey, process.item.operators);
      const bulkRemove = async () => await validatorStore.bulkRemoveValidators(selectedValidatorKeys.filter((publicKey: string) => selectedValidators[publicKey].isSelected), process.item.operators.map((operator: IOperator) => operator.id));
      res = condition ? await bulkRemove() : await singleRemove();
      if (res) {
        backToSingleClusterPage();
      }
    }
  };

  const stepBack = () => setCurrentStep(BULK_STEPS.BULK_ACTIONS);

  if (currentStep === BULK_STEPS.BULK_ACTIONS && !process.validator) {
    return <NewBulkActions nextStep={nextStep}
                           maxValidatorsCount={MAX_VALIDATORS_COUNT}
                           title={BULK_FLOWS_ACTION_TITLE[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
                           fillSelectedValidators={fillSelectedValidators}
                           selectedValidators={selectedValidators}
                           onCheckboxClickHandler={onCheckboxClickHandler}/>;
  }

  if (currentStep === BULK_STEPS.BULK_CONFIRMATION) {
    return  <ConfirmationStep stepBack={!process.validator ? stepBack : undefined}
          flowData={BULK_FLOWS_CONFIRMATION_DATA[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
          selectedValidators={Object.keys(selectedValidators).filter((publicKey: string) => selectedValidators[publicKey].isSelected)} nextStep={nextStep}/>;
  }

  // BULK_STEPS.BULK_EXIT_FINISH === currentStep
  return <ExitFinishPage nextStep={nextStep} selectedValidators={Object.keys(selectedValidators).filter((publicKey: string) => selectedValidators[publicKey].isSelected)}/>;
};

export default BulkComponent;