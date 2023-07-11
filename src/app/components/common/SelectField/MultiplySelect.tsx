import React, { useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '~app/components/common/SelectField/SelectField.styles';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';

const MultiplySelect = ({ fieldKey, placeholder }: { fieldKey: string, placeholder: string }) => {
    const classes = useStyles();
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const { value, options } = metadataStore.getMetadataEntity(fieldKey);
    const [values, setValues] = React.useState<string[]>([]);

    useEffect(() => setValues(value?.split(',')), []);

    const handleChange = (event: any) => {
        setValues(metadataStore.setMetadataValue(fieldKey, event.target.value));
    };

    return (
            <Select
                className={classes.SelectExtendClass}
                fullWidth
                multiple
                value={values}
                onChange={handleChange}
                placeholder={placeholder}
                renderValue={(selected) => (
                    <div >
                        {(selected as string[]).map((option) => (
                            <Chip key={option} label={option} />
                        ))}
                    </div>
                )}>
                {options?.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
    );
};

export default MultiplySelect;