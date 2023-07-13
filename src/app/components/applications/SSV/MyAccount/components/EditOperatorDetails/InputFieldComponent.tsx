import React, { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
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
        setCurrentValue(metadataStore.setMetadataValue(fieldKey, value.trim()));
    };

    return (
        <TextInput
            value={currentValue}
            extendInputClass={classes.fontSmallSize}
            extendClass={extendClass}
            placeHolder={placeholder}
            onChangeCallback={onChangeHandler}/>
    );
};

export default InputFieldComponent;
