import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '~app/components/common/SelectField/SelectField.styles';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';

const SelectField = ({ fieldKey, placeholder } : { fieldKey: string, placeholder: string }) => {
    const classes = useStyles();
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const options = metadataStore.getMetadataEntity(fieldKey).options!;
    const [currentValue, setCurrentValue] = useState(metadataStore.getMetadataEntity(fieldKey).value);

    const changeValueHandler = (event: any) => {
        const { value } = event.target;
        setCurrentValue(metadataStore.setMetadataValue(fieldKey, value));
    };

    return (
            <Select
                className={classes.SelectExtendClass}
                fullWidth
                value={currentValue}
                onChange={changeValueHandler}
                placeholder={placeholder}
            >
                {options.map((option: string, index: number ) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
            </Select>
    );
};

export default SelectField;
