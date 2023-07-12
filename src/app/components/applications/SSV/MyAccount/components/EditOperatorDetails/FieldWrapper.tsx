import React from 'react';
import { Grid, Typography } from '@mui/material';
import { useStores } from '~app/hooks/useStores';
import InputLabel from '~app/components/common/InputLabel';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper';
import SelectField from '~app/components/common/SelectField/SelectField';
import MultiplySelect from '~app/components/common/SelectField/MultiplySelect';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import UploadImageInput
    from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/UploadImageInput';
import InputFieldComponent
    from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/InputFieldComponent';
import {
    useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import CountriesAutocompleteInput
    from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/CountriesAutocompleteInput';
import DynamicTextarea from '~app/components/common/DynamicTextArea/DynamicTextArea';

const FieldWrapper = ({ fieldKey }: { fieldKey: string }) => {
    const classes = useStyles();
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const { label, errorMessage, placeholderText, additionalLabelText } = metadataStore.getMetadataEntity(fieldKey);

    const extendClasses = {
        [FIELD_KEYS.DESCRIPTION]: classes.DescriptionInput,
        [FIELD_KEYS.OPERATOR_IMAGE]: classes.DropFileInput,
    };
    
    const components = {
        [FIELD_KEYS.MEV_RELAYS]: MultiplySelect,
        [FIELD_KEYS.CONSENSUS_CLIENT]: SelectField,
        [FIELD_KEYS.EXECUTION_CLIENT]: SelectField,
        [FIELD_KEYS.OPERATOR_IMAGE]: UploadImageInput,
        [FIELD_KEYS.WEBSITE_URL]: InputFieldComponent,
        [FIELD_KEYS.TWITTER_URL]: InputFieldComponent,
        [FIELD_KEYS.DESCRIPTION]: DynamicTextarea,
        [FIELD_KEYS.LINKEDIN_URL]: InputFieldComponent,
        [FIELD_KEYS.OPERATOR_NAME]: InputFieldComponent,
        [FIELD_KEYS.SETUP_PROVIDER]: InputFieldComponent,
        [FIELD_KEYS.LOCATION]: CountriesAutocompleteInput,
    };

    const Component = components[fieldKey];
    return (
        <Grid container item>
            <Grid container>
                <Grid item container>
                    <InputLabel title={label} additionalLabel={additionalLabelText}/>
                    <Component fieldKey={fieldKey} placeholder={placeholderText} extendClass={extendClasses[fieldKey]} />
                </Grid>
                <Typography className={classes.ErrorMessage}>{fieldKey !== FIELD_KEYS.OPERATOR_IMAGE && errorMessage}</Typography>
            </Grid>
        </Grid>
    );
};

export default FieldWrapper;