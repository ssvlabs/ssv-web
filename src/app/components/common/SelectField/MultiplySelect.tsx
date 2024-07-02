import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useStyles } from '~app/components/common/SelectField/SelectField.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { selectMetadataEntityByName, setMetadataValue } from '~app/redux/operatorMetadata.slice.ts';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper.ts';

const MultiplySelect = ({ fieldKey, placeholder }: { fieldKey: FIELD_KEYS; placeholder: string }) => {
  const classes = useStyles({});
  const dispatch = useAppDispatch();
  const { value, options } = useAppSelector((state) => selectMetadataEntityByName(state, fieldKey));
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    const operatorMevRelays = (value ?? '').trim().split(',');
    setValues(operatorMevRelays.filter((v: string) => v));
  }, []);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    dispatch(
      setMetadataValue({
        metadataFieldName: fieldKey,
        value: event.target.value
      })
    );
    setValues(event.target.value as string[]);
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
