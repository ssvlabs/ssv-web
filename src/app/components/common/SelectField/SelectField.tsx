import { useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useStyles } from '~app/components/common/SelectField/SelectField.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { selectMetadataEntityByName, selectMetadataValueByName, setMetadataValue } from '~app/redux/operatorMetadata.slice.ts';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper.ts';

const SelectField = ({ fieldKey, placeholder }: { fieldKey: FIELD_KEYS; placeholder: string }) => {
  const dispatch = useAppDispatch();
  const options = useAppSelector((state) => selectMetadataEntityByName(state, fieldKey)).options ?? [];
  const [currentValue, setCurrentValue] = useState(useAppSelector((state) => selectMetadataValueByName(state, fieldKey)));
  const [isPlaceholder, setIsPlaceholder] = useState(!currentValue);

  const changeValueHandler = (event: SelectChangeEvent) => {
    const { value } = event.target;
    dispatch(
      setMetadataValue({
        metadataFieldName: fieldKey,
        value
      })
    );
    setCurrentValue(value);
    setIsPlaceholder(!value);
  };

  const classes = useStyles({ isPlaceholder: !currentValue });
  return (
    <FormControl className={classes.SelectExtendClass} fullWidth>
      <Select className={classes.ChipExtendClass} value={currentValue} onChange={changeValueHandler} placeholder={placeholder} displayEmpty>
        <MenuItem className={`${isPlaceholder && classes.PlaceholderColor}`} value={''} disabled={isPlaceholder}>
          {isPlaceholder ? placeholder : 'None'}
        </MenuItem>
        {options.map((option: string, index: number) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;
