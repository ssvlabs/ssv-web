import { useStores } from '~app/hooks/useStores';
import CheckboxStore from '~app/common/stores/applications/SsvWeb/Checkbox.store';
import { getCurrentNetwork, NETWORKS } from '~lib/utils/envHelper';

export const useTermsAndConditions = () => {
    const stores = useStores();
    const { networkId } = getCurrentNetwork();
    const checkboxStore: CheckboxStore = stores.Checkbox;
    const isMainnet: boolean = networkId === NETWORKS.MAINNET;
    const checkedCondition = isMainnet ? checkboxStore.checkedCondition : true;
    const checkedConditionHandler = () => checkboxStore.checkedCondition ? checkboxStore.setCheckboxStateFalse() : checkboxStore.setCheckboxStateTrue();

    return { networkId, checkedConditionHandler, checkedCondition, isMainnet };
};