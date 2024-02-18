import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import { BULK_FLOWS } from '~app/common/stores/applications/SsvWeb/processes/SingleCluster';
import NewBulkActions from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/NewBulkActions';
import ExitFinishPage from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ExitFinishPage';
import ConfirmationStep from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ConfirmationStep';
import { IOperator, ProcessStore, ValidatorStore, SingleCluster as SingleClusterProcess } from '~app/common/stores/applications/SsvWeb';

const BULK_FLOWS_ACTION_TITLE = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_REMOVE_VALIDATORS,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_EXIT_VALIDATORS,
};

const BULK_FLOWS_CONFIRMATION_DATA = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.REMOVE,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.EXIT,
};

const BulkComponent = () => {
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const process: SingleClusterProcess = processStore.getProcess;
  const navigate = useNavigate();
  const currentBulkFlow = process.currentBulkFlow;
  const [currentStep, setCurrentStep] = useState(translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_ACTIONS);

  useEffect(() => {
    if (process.validator) {
      setSelectedValidators([process.validator.public_key]);
      setCurrentStep(translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_CONFIRMATION);
    }
  }, []);

  const selectUnselectAllValidators = (publicKeys: string[], callback: Function) => {
    let nextState = publicKeys;
    if (selectedValidators.length === publicKeys.length || selectedValidators.length > 0) {
      nextState = [];
    }
    setSelectedValidators(nextState);
    callback(!!nextState.length);
  };

  const onCheckboxClickHandler = (isChecked: boolean, publicKey: string) => {
    if (isChecked && !selectedValidators.includes(publicKey)) {
      setSelectedValidators((prevState: string[]) => [...prevState, publicKey]);
    } else {
      setSelectedValidators((prevState: string[]) => prevState.filter((key: string) => key !== publicKey));
    }
  };

  const nextStep = async () => {
    if (currentStep === translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_ACTIONS) {
      setCurrentStep(translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_CONFIRMATION);
    } else if (currentStep === translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_CONFIRMATION && currentBulkFlow === BULK_FLOWS.BULK_EXIT) {
      if (selectedValidators.length === 1) {
        await validatorStore.exitValidator(`0x${selectedValidators[0]}`, process.item.operators.map((operator: IOperator) => operator.id));
      } else {
        await validatorStore.bulkExitValidators(selectedValidators.map((publicKey: string) => `0x${publicKey}`), process.item.operators.map((operator: IOperator) => operator.id));
      }
      setCurrentStep(translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_EXIT_FINISH);
    } else if (currentStep === translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_EXIT_FINISH) {
      process.validator = undefined;
      navigate(-1);
    } else {
      if (selectedValidators.length === 1) {
        await validatorStore.removeValidator(process.validator);
      } else {
        await validatorStore.bulkRemoveValidators(selectedValidators.map((publicKey: string) => `0x${publicKey}`), process.item.operators.map((operator: IOperator) => operator.id));
      }
      process.validator = undefined;
      navigate(-1);
    }
  };

  const components = {
    [translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_ACTIONS]: <NewBulkActions nextStep={nextStep}
                                               title={BULK_FLOWS_ACTION_TITLE[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
                                               selectUnselectAllValidators={selectUnselectAllValidators}
                                               selectedValidators={selectedValidators}
                                               onCheckboxClickHandler={onCheckboxClickHandler}/>,
    [translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_CONFIRMATION]: <ConfirmationStep
      flowData={BULK_FLOWS_CONFIRMATION_DATA[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
      selectedValidators={selectedValidators} nextStep={nextStep}/>,
    [translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_STEPS.BULK_EXIT_FINISH]: <ExitFinishPage nextStep={nextStep} selectedValidators={selectedValidators}/>,
  };

  const Component = components[currentStep];

  return Component;
};

export default BulkComponent;