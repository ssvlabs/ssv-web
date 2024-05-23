import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useStores } from '~app/hooks/useStores';
import FormControl from '@mui/material/FormControl';
import { useStyles } from '~app/components/common/SelectField/SelectField.styles';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';

const MultiplySelect = ({ fieldKey, placeholder }: { fieldKey: string; placeholder: string }) => {
  const classes = useStyles({});
  const stores = useStores();
  const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
  const { value, options } = metadataStore.getMetadataEntity(fieldKey);
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    const operatorMevRelays = (value ?? '').trim().split(',');
    setValues(operatorMevRelays.filter((v: string) => v));
  }, []);

  const handleChange = (event: any) => {
    setValues(metadataStore.setMetadataValue(fieldKey, event.target.value));
  };

  return (
    <FormControl className={`${classes.SelectExtendClass} ${classes.multiplyInput}`} fullWidth>
      <Select
        multiple
        value={values}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) =>
          selected?.length ? (
            <div>
              {(selected as string[]).map((option) => (
                <Chip className={classes.ChipExtendClass} key={option} label={option} />
              ))}
            </div>
          ) : (
            <MenuItem className={classes.PlaceholderColor} value="">
              {placeholder}
            </MenuItem>
          )
        }
      >
        <MenuItem className={classes.PlaceholderColor} value="" disabled>
          {placeholder}
        </MenuItem>
        {options?.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiplySelect;
