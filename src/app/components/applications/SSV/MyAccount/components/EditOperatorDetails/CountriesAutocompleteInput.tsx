import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CountryType } from '~lib/utils/operatorMetadataHelper';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { getLocationsData, getLocationsList, getMetadataValueByName, setMetadataValue } from '~app/redux/operatorMetadata.slice.ts';

const CountriesAutocompleteInput = ({ fieldKey, placeholder }: { fieldKey: string; placeholder: string }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [currentCountry, setCurrentCountry] = useState(useAppSelector((state) => getMetadataValueByName(state, fieldKey)));
  const locationsData = useAppSelector(getLocationsData);
  const locationsList = useAppSelector(getLocationsList);

  useEffect(() => setCurrentCountry(countryWithAlpha(currentCountry)), [locationsData.toString()]);

  const customFilterOptions = (_options: any, state: any) => {
    const inputValue = state.inputValue.toLowerCase();
    return locationsData.filter((d) => d.name.toLowerCase().includes(inputValue) || d['alpha-3'].toLowerCase().includes(inputValue)).map((d) => `${d.name} (${d['alpha-3']})`);
  };

  const onFocusHandler = () => {
    setCurrentCountry(currentCountry);
  };

  const onBlurHandler = () => {
    setCurrentCountry(countryWithAlpha(currentCountry));
  };

  const onTagsChange = (event: any, value: any) => {
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
      onInputChange={(e: any, value: any) => onTagsChange(e, value)}
      options={locationsData.map((country: CountryType) => country.name)}
      renderInput={(params) => <TextField placeholder={placeholder} className={classes.AutocompleteInner} {...params} />}
    />
  );
};

export default CountriesAutocompleteInput;
