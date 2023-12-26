import { useStores } from '~app/hooks/useStores';
import CheckboxStore from '~app/common/stores/applications/SsvWeb/Checkbox.store';
import { getStoredNetwork, NETWORKS } from '~root/providers/networkInfo.provider';

export const useTermsAndConditions = () => {
    const stores = useStores();
    const { networkId } = getStoredNetwork();
    const checkboxStore: CheckboxStore = stores.Checkbox;
    const isMainnet: boolean = networkId === NETWORKS.MAINNET;
    const checkedCondition = isMainnet ? checkboxStore.checkedCondition : true;
    const checkedConditionHandler = () => checkboxStore.checkedCondition ? checkboxStore.setCheckboxStateFalse() : checkboxStore.setCheckboxStateTrue();

    return { networkId, checkedConditionHandler, checkedCondition, isMainnet };
};
