import React, { useState } from 'react';
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

const CountriesAutocompleteInput = ({ fieldKey }: { fieldKey: string }) => {
    const classes = useStyles();
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const data: CountryType[] = JSON.parse(JSON.stringify(jsonCountriesFile));
    const [currentCountry, setCurrentCountry] = useState(metadataStore.getMetadataValue(fieldKey));

    const onTagsChange = (event: any, value: any) => {
        metadataStore.setMetadataValue(fieldKey, value);
        setCurrentCountry(metadataStore.setMetadataValue(fieldKey, value));
    };

    return (
        <Autocomplete
            className={classes.AutocompleteInput}
            inputValue={currentCountry}
            onInputChange={onTagsChange}
            id="controllable-states-demo"
            options={data.map((country: CountryType) => country.name)}
            renderInput={params => <TextField
                className={classes.AutocompleteInner}
                {...params}  />}
        />
    );
};

export default CountriesAutocompleteInput;
