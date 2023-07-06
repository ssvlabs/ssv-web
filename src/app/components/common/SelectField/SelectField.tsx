import React, { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useStyles } from '~app/components/common/SelectField/SelectField.styles';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';

const SelectField = ({ fieldKey, placeholder } : { fieldKey: string, placeholder: string }) => {
    const classes = useStyles();
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const options = metadataStore.getMetadata(fieldKey).options!;
    const [currentValue, setCurrentValue] = useState(metadataStore.getMetadata(fieldKey).value);

    const changeValueHandler = (event: SelectChangeEvent) => {
        const { value } = event.target;
        setCurrentValue(metadataStore.setMetadataValue(fieldKey, value));
    };

    return (
        <FormControl className={classes.SelectExtendClass} fullWidth>
            <Select
                value={currentValue}
                onChange={changeValueHandler}
                placeholder={placeholder}
            >
                {options.map((option: string, index: number ) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
            </Select>
        </FormControl>
    );
};

export default SelectField;
