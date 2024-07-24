import { xor } from 'lodash';
import { useEffect, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { translations } from '~app/common/config';
import ConfirmationStep from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ConfirmationStep';
import ExitFinishPage from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/ExitFinishPage';
import NewBulkActions from '~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/NewBulkActions';
import { BULK_FLOWS } from '~app/enums/bulkFlow.enum.ts';
import { useClusterValidators } from '~app/hooks/cluster/useClusterValidators';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { getSelectedCluster, setExcludedCluster } from '~app/redux/account.slice.ts';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getAccountAddress, getIsContractWallet } from '~app/redux/wallet.slice';
import { BulkActionRouteState } from '~app/Routes';
import { MAXIMUM_VALIDATOR_COUNT_FLAG } from '~lib/utils/developerHelper';
import { add0x } from '~lib/utils/strings';
import { exitValidators, removeValidators } from '~root/services/validatorContract.service';

enum BULK_STEPS {
  BULK_ACTIONS = 'BULK_ACTIONS',
  BULK_CONFIRMATION = 'BULK_CONFIRMATION',
  BULK_EXIT_FINISH = 'BULK_EXIT_FINISH'
}

const BULK_FLOWS_ACTION_TITLE = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_REMOVE_VALIDATORS,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.BULK_TITLES.SELECT_EXIT_VALIDATORS
};

export const MAX_VALIDATORS_COUNT = Number(window.localStorage.getItem(MAXIMUM_VALIDATOR_COUNT_FLAG)) || 100;

const BULK_FLOWS_CONFIRMATION_DATA = {
  [BULK_FLOWS.BULK_REMOVE]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.REMOVE,
  [BULK_FLOWS.BULK_EXIT]: translations.VALIDATOR.REMOVE_EXIT_VALIDATOR.FLOW_CONFIRMATION_DATA.EXIT
};

const BulkComponent = () => {
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(BULK_STEPS.BULK_ACTIONS);
  const navigate = useNavigate();
  const accountAddress = useAppSelector(getAccountAddress);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const cluster = useAppSelector(getSelectedCluster);

  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);

  const { infiniteQuery, fetchAll, validators } = useClusterValidators(cluster);
  const maxSelectable = cluster.validatorCount;

  const isAllSelected = selectedValidators.length === maxSelectable;

  const location: Location<BulkActionRouteState> = useLocation();
  const { validator, currentBulkFlow } = location.state;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (validator) {
      setSelectedValidators([add0x(validator.public_key)]);
      setCurrentStep(BULK_STEPS.BULK_CONFIRMATION);
    }
  }, []);

  const onToggleAll = () => {
    if (!isAllSelected && validators.length < maxSelectable) {
      return fetchAll.mutateAsync().then((data) => {
        if (!data) return;
        return setSelectedValidators(data.slice(0, maxSelectable)?.map((validator) => add0x(validator.public_key)));
      });
    }

    if (!isAllSelected) {
      setSelectedValidators(validators.slice(0, maxSelectable).map((validator) => add0x(validator.public_key)));
    } else {
      setSelectedValidators([]);
    }
  };

  const onValidatorToggle = (publicKey: string) => {
    setSelectedValidators((prev) => xor(prev, [publicKey]));
  };

  const backToSingleClusterPage = (validatorsCount?: number) => {
    navigate(validatorsCount === cluster.validatorCount && cluster.isLiquidated ? -2 : -1);
  };

  const nextStep = async () => {
    let res;
    const selectedValidatorsCount = selectedValidators.length;
    const isBulk = selectedValidators.length > 1;
    const validatorPks = isBulk ? selectedValidators : selectedValidators[0];
    if (currentStep === BULK_STEPS.BULK_ACTIONS) {
      setCurrentStep(BULK_STEPS.BULK_CONFIRMATION);
    } else if (currentStep === BULK_STEPS.BULK_CONFIRMATION && currentBulkFlow === BULK_FLOWS.BULK_EXIT) {
      res = await exitValidators({
        isContractWallet,
        validatorIds: validatorPks,
        operatorIds: cluster.operators.map((operator: IOperator) => operator.id),
        isBulk,
        dispatch
      });
      if (res && !isContractWallet) {
        setCurrentStep(BULK_STEPS.BULK_EXIT_FINISH);
      }
    } else if (currentStep === BULK_STEPS.BULK_EXIT_FINISH) {
      backToSingleClusterPage();
    } else {
      if (selectedValidatorsCount === cluster.validatorCount && cluster.isLiquidated) {
        dispatch(setExcludedCluster(cluster));
      }
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
    }
  };

  const stepBack = () => setCurrentStep(BULK_STEPS.BULK_ACTIONS);

  if (currentStep === BULK_STEPS.BULK_ACTIONS && !validator) {
    return (
      <NewBulkActions
        title={BULK_FLOWS_ACTION_TITLE[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
        nextStep={nextStep}
        listProps={{
          type: 'select',
          validators: validators,
          withoutSettings: true,
          onToggleAll,
          maxSelectable,
          selectedValidators,
          onValidatorToggle,
          isEmpty: infiniteQuery.isSuccess && validators.length === 0,
          infiniteScroll: infiniteQuery,
          isFetchingAll: fetchAll.isPending
        }}
      />
    );
  }

  if (currentStep === BULK_STEPS.BULK_CONFIRMATION) {
    return (
      <ConfirmationStep
        stepBack={!validator ? stepBack : undefined}
        flowData={BULK_FLOWS_CONFIRMATION_DATA[currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE]}
        selectedValidators={selectedValidators}
        isLoading={false}
        currentBulkFlow={currentBulkFlow ?? BULK_FLOWS.BULK_REMOVE}
        nextStep={nextStep}
      />
    );
  }

  // BULK_STEPS.BULK_EXIT_FINISH === currentStep
  return <ExitFinishPage nextStep={nextStep} selectedValidators={selectedValidators} />;
};

export default BulkComponent;
