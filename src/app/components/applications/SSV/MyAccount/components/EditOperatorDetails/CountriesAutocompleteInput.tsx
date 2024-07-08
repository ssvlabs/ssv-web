import { SyntheticEvent, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CountryType, FIELD_KEYS } from '~lib/utils/operatorMetadataHelper';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { selectLocationsData, selectLocationsList, selectMetadataValueByName, setMetadataValue } from '~app/redux/operatorMetadata.slice.ts';
import { FilterOptionsState } from '@mui/base/useAutocomplete/useAutocomplete';

const CountriesAutocompleteInput = ({ fieldKey, placeholder }: { fieldKey: FIELD_KEYS; placeholder: string }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [currentCountry, setCurrentCountry] = useState(useAppSelector((state) => selectMetadataValueByName(state, fieldKey)));
  const locationsData = useAppSelector(selectLocationsData);
  const locationsList = useAppSelector(selectLocationsList);

  const locationDataString = locationsData.toString();
  useEffect(() => setCurrentCountry(countryWithAlpha(currentCountry)), [locationDataString]);

  const customFilterOptions = (_options: string[], state: FilterOptionsState<string>) => {
    const inputValue = state.inputValue.toLowerCase();
    return locationsData.filter((d) => d.name.toLowerCase().includes(inputValue) || d['alpha-3'].toLowerCase().includes(inputValue)).map((d) => `${d.name} (${d['alpha-3']})`);
  };

  const onFocusHandler = () => {
    setCurrentCountry(currentCountry);
  };

  const onBlurHandler = () => {
    setCurrentCountry(countryWithAlpha(currentCountry));
  };

  const onTagsChange = (event: SyntheticEvent, value: string) => {
    if (event) {
      setCurrentCountry(value);
      dispatch(
        setMetadataValue({
          metadataFieldName: fieldKey,
          value: locationsList[value]
        })
      );
    }
  };

  const countryWithAlpha = (location: string) => {
    const country = locationsData.find((c) => c.name === location);
    return country ? `${location} (${country['alpha-3']})` : location;
  };

  return (
    <Autocomplete
      className={classes.AutocompleteInput}
      inputValue={currentCountry}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      filterOptions={customFilterOptions}
      onInputChange={(e: SyntheticEvent, value: string) => onTagsChange(e, value)}
      options={locationsData.map((country: CountryType) => country.name)}
      renderInput={(params) => <TextField placeholder={placeholder} className={classes.AutocompleteInner} {...params} />}
    />
  );
};

export default CountriesAutocompleteInput;
