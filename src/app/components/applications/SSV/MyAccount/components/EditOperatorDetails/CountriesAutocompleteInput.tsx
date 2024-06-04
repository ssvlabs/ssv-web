import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useStores } from '~app/hooks/useStores';
import { CountryType } from '~lib/utils/operatorMetadataHelper';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';

const CountriesAutocompleteInput = ({ fieldKey, placeholder }: { fieldKey: string; placeholder: string }) => {
  const classes = useStyles();
  const stores = useStores();
  const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
  const [currentCountry, setCurrentCountry] = useState(metadataStore.getMetadataValue(fieldKey));

  useEffect(() => setCurrentCountry(countryWithAlpha(currentCountry)), [metadataStore.locationsData.toString()]);

  const customFilterOptions = (_options: any, state: any) => {
    const inputValue = state.inputValue.toLowerCase();
    return metadataStore.locationsData
      .filter((d) => d.name.toLowerCase().includes(inputValue) || d['alpha-3'].toLowerCase().includes(inputValue))
      .map((d) => `${d.name} (${d['alpha-3']})`);
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
      metadataStore.setMetadataValue(fieldKey, metadataStore.locationsList[value]);
    }
  };

  const countryWithAlpha = (location: string) => {
    const country = metadataStore.locationsData.find((c) => c.name === location);
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
      options={metadataStore.locationsData.map((country: CountryType) => country.name)}
      renderInput={(params) => <TextField placeholder={placeholder} className={classes.AutocompleteInner} {...params} />}
    />
  );
};

export default CountriesAutocompleteInput;
