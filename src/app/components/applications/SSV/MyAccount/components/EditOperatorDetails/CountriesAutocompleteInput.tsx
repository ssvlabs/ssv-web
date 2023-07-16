import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useStores } from '~app/hooks/useStores';
import jsonCountriesFile from '~lib/files/countries.json';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import {
    useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';

type CountryType = {
    'alpha-2': string;
    'alpha-3': string;
    'country-code': string;
    'intermediate-region': string;
    'intermediate-region-code': string;
    'iso_3166-2': string;
    name: string;
    region: string;
    'region-code': string;
    'sub-region': string;
    'sub-region-code': string;
};

const CountriesAutocompleteInput = ({ fieldKey, placeholder }: { fieldKey: string, placeholder: string }) => {
    const classes = useStyles();
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const data: CountryType[] = JSON.parse(JSON.stringify(jsonCountriesFile));
    const [currentCountry, setCurrentCountry] = useState(metadataStore.getMetadataValue(fieldKey));

    const customFilterOptions = (options: any, state: any) => {
        const inputValue = state.inputValue.toLowerCase();
        return data.filter(d => d.name.toLowerCase().includes(inputValue) || d['alpha-2'].toLowerCase().includes(inputValue)).map(d => d.name);
    };

    const onFocusHandler = () => {
        setShowingValue(currentCountry);
    };

    const onBlurHandler = () => {
        setShowingValue(countryWithAlpha());
    };

    const onTagsChange = (event: any, value: any) => {
        if (event) {
            metadataStore.setMetadataValue(fieldKey, value);
            setCurrentCountry(metadataStore.setMetadataValue(fieldKey, value));
        }
    };

    const countryWithAlpha = () => {
        const country = data.find(c => c.name === currentCountry);
        return country ? `${currentCountry} (${country['alpha-2']})` : currentCountry;
    };

    const [showingValue, setShowingValue] = useState(countryWithAlpha());

    useEffect(() => { setShowingValue(countryWithAlpha());}, [currentCountry]);

    return (
        <Autocomplete
            className={classes.AutocompleteInput}
            inputValue={showingValue}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            filterOptions={customFilterOptions}
            onInputChange={(e: any, value: any) => onTagsChange(e, value)}
            options={data.map((country: CountryType) => country.name)}
            renderInput={params => <TextField
                placeholder={placeholder}
                className={classes.AutocompleteInner}
                {...params}  />}
        />
    );
};

export default CountriesAutocompleteInput;
