import { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import { FIELD_KEYS, HTTPS_PREFIX } from '~lib/utils/operatorMetadataHelper';

import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';

const InputFieldComponent = ({
  fieldKey,
  extendClass,
  placeholder
}: {
  fieldKey: string;
  placeholder: string;
  extendClass?: string;
}) => {
  const classes = useStyles();
  const stores = useStores();
  const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
  const [currentValue, setCurrentValue] = useState(
    metadataStore.getMetadataValue(fieldKey)
  );

  const onPasteHandler = (event: any) => {
    if (fieldKey === FIELD_KEYS.DKG_ADDRESS) {
      // Prevent the default paste behavior
      event.preventDefault();

      // Get the pasted value from clipboard
      let pastedValue = event.clipboardData.getData('text');

      // If the value starts with HTTPS_PREFIX, remove it
      if (pastedValue.startsWith(HTTPS_PREFIX)) {
        pastedValue = pastedValue.substring(HTTPS_PREFIX.length);
      }

      setCurrentValue(HTTPS_PREFIX + pastedValue);
      metadataStore.setMetadataValue(fieldKey, HTTPS_PREFIX + pastedValue);
    }
  };

  const onChangeHandler = (event: any) => {
    const { value } = event.target;
    if (fieldKey === FIELD_KEYS.DKG_ADDRESS) {
      setCurrentValue(value);
      metadataStore.setMetadataValue(fieldKey, value);
    } else {
      setCurrentValue(value.length > 1 ? value : value.trim());
      metadataStore.setMetadataValue(fieldKey, value.trim());
    }
  };

  const onFocusHandler = () => {
    if (fieldKey === FIELD_KEYS.DKG_ADDRESS && !currentValue) {
      setCurrentValue(HTTPS_PREFIX);
    }
  };

  return (
    <TextInput
      value={currentValue}
      extendInputClass={classes.fontSmallSize}
      extendClass={extendClass}
      placeHolder={placeholder}
      onFocusCallback={onFocusHandler}
      onPasteCallback={onPasteHandler}
      onChangeCallback={onChangeHandler}
    />
  );
};

export default InputFieldComponent;
