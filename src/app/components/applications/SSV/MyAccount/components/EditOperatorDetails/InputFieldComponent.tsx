import React, { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import { FIELD_KEYS, HTTP_PREFIX } from '~lib/utils/operatorMetadataHelper';

import {
    useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';

const InputFieldComponent = ({ fieldKey, extendClass, placeholder  }: { fieldKey: string, placeholder: string, extendClass?: string }) => {
    const classes = useStyles();
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const [currentValue, setCurrentValue] = useState(metadataStore.getMetadataValue(fieldKey));

    const onChangeHandler = (event: any) => {
        const { value } = event.target;

        if (fieldKey === FIELD_KEYS.DKG_ADDRESS) {
            // Ensure http:// is always present
            if (!value.startsWith(HTTP_PREFIX)) {
                setCurrentValue(HTTP_PREFIX);
                return;
            }
            setCurrentValue(value);
            metadataStore.setMetadataValue(fieldKey, value);
        } else {
            setCurrentValue(value.length > 1 ? value : value.trim());
            metadataStore.setMetadataValue(fieldKey, value.trim());
        }
    };

    const onFocusHandler = () => {
        if (fieldKey === FIELD_KEYS.DKG_ADDRESS && !currentValue) {
            setCurrentValue(HTTP_PREFIX);
        }
    };

    return (
        <TextInput
            value={currentValue}
            extendInputClass={classes.fontSmallSize}
            extendClass={extendClass}
            placeHolder={placeholder}
            onFocusCallback={onFocusHandler}
            onChangeCallback={onChangeHandler}/>
    );
};

export default InputFieldComponent;
