import { useStores } from '~app/hooks/useStores';
import CheckboxStore from '~app/common/stores/applications/SsvWeb/Checkbox.store';
import { isMainnet } from '~root/providers/networkInfo.provider';

export const useTermsAndConditions = () => {
    const stores = useStores();
    const checkboxStore: CheckboxStore = stores.Checkbox;
    const checkedCondition = isMainnet() ? checkboxStore.checkedCondition : true;
    const checkedConditionHandler = () => checkboxStore.checkedCondition ? checkboxStore.setCheckboxStateFalse() : checkboxStore.setCheckboxStateTrue();

    return { checkedConditionHandler, checkedCondition };
};
