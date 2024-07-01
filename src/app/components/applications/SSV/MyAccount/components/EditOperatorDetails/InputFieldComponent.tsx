import { ChangeEvent, ClipboardEvent, useState } from 'react';
import TextInput from '~app/components/common/TextInput';
import { FIELD_KEYS, HTTPS_PREFIX } from '~lib/utils/operatorMetadataHelper';

import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { selectMetadataValueByName, setMetadataValue } from '~app/redux/operatorMetadata.slice.ts';

const InputFieldComponent = ({ fieldKey, extendClass, placeholder }: { fieldKey: FIELD_KEYS; placeholder: string; extendClass?: string }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [currentValue, setCurrentValue] = useState(useAppSelector((state) => selectMetadataValueByName(state, fieldKey)));

  const onPasteHandler = (event: ClipboardEvent) => {
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
      dispatch(setMetadataValue({ metadataFieldName: fieldKey, value: HTTPS_PREFIX + pastedValue }));
    }
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (fieldKey === FIELD_KEYS.DKG_ADDRESS) {
      setCurrentValue(value);
      dispatch(setMetadataValue({ metadataFieldName: fieldKey, value }));
    } else {
      setCurrentValue(value.length > 1 ? value : value.trim());
      dispatch(setMetadataValue({ metadataFieldName: fieldKey, value: value.trim() }));
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
