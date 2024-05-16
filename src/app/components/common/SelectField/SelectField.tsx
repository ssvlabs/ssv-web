import  { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '~app/components/common/SelectField/SelectField.styles';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';

const SelectField = ({ fieldKey, placeholder } : { fieldKey: string, placeholder: string }) => {
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const options = metadataStore.getMetadataEntity(fieldKey).options!;
    const [currentValue, setCurrentValue] = useState(metadataStore.getMetadataEntity(fieldKey).value);
    const [isPlaceholder, setIsPlaceholder] = useState(!currentValue);
    
    const changeValueHandler = (event: any) => {
        const { value } = event.target;
        setCurrentValue(metadataStore.setMetadataValue(fieldKey, value));
        setIsPlaceholder(!value);
    };

    const classes = useStyles({ isPlaceholder: !currentValue });
    return (
        <FormControl className={classes.SelectExtendClass} fullWidth>
            <Select
                className={classes.ChipExtendClass}
                value={currentValue}
                onChange={changeValueHandler}
                placeholder={placeholder}
                displayEmpty
            >
                <MenuItem className={`${isPlaceholder && classes.PlaceholderColor}`} value={''} disabled={isPlaceholder}>
                    {isPlaceholder ? placeholder : 'None'}
                </MenuItem>
                {options.map((option: string, index: number ) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
            </Select>
        </FormControl>
    );
};

export default SelectField;
