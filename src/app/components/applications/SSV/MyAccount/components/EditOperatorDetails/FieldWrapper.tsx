import { Grid, Typography } from '@mui/material';
import InputLabel from '~app/components/common/InputLabel';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper';
import SelectField from '~app/components/common/SelectField/SelectField';
import MultiplySelect from '~app/components/common/SelectField/MultiplySelect';
import UploadImageInput from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/UploadImageInput';
import InputFieldComponent from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/InputFieldComponent';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import CountriesAutocompleteInput from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/CountriesAutocompleteInput';
import DynamicTextarea from '~app/components/common/DynamicTextArea/DynamicTextArea';
import { useAppSelector } from '~app/hooks/redux.hook.ts';
import { selectMetadataEntityByName } from '~app/redux/operatorMetadata.slice.ts';

const FieldWrapper = ({ fieldKey }: { fieldKey: FIELD_KEYS }) => {
  const classes = useStyles();
  const { label, errorMessage, placeholderText, additionalLabelText, toolTipText } = useAppSelector((state) => selectMetadataEntityByName(state, fieldKey));

  const extendClasses: { [key in FIELD_KEYS]?: string } = {
    [FIELD_KEYS.DESCRIPTION]: classes.DescriptionInput,
    [FIELD_KEYS.OPERATOR_IMAGE]: classes.DropFileInput
  };

  const components = {
    [FIELD_KEYS.MEV_RELAYS]: MultiplySelect,
    [FIELD_KEYS.CONSENSUS_CLIENT]: SelectField,
    [FIELD_KEYS.EXECUTION_CLIENT]: SelectField,
    [FIELD_KEYS.OPERATOR_IMAGE]: UploadImageInput,
    [FIELD_KEYS.WEBSITE_URL]: InputFieldComponent,
    [FIELD_KEYS.TWITTER_URL]: InputFieldComponent,
    [FIELD_KEYS.DKG_ADDRESS]: InputFieldComponent,
    [FIELD_KEYS.DESCRIPTION]: DynamicTextarea,
    [FIELD_KEYS.LINKEDIN_URL]: InputFieldComponent,
    [FIELD_KEYS.OPERATOR_NAME]: InputFieldComponent,
    [FIELD_KEYS.SETUP_PROVIDER]: InputFieldComponent,
    [FIELD_KEYS.LOCATION]: CountriesAutocompleteInput
  };

  const Component = components[fieldKey];
  return (
    <Grid container item>
      <Grid container>
        <Grid item container>
          <InputLabel title={label} withHint={!!toolTipText} additionalLabel={additionalLabelText} toolTipText={toolTipText} />
          <Component fieldKey={fieldKey} placeholder={placeholderText} extendClass={extendClasses[fieldKey]} />
        </Grid>
        <Typography className={classes.ErrorMessage}>{fieldKey !== FIELD_KEYS.OPERATOR_IMAGE && errorMessage}</Typography>
      </Grid>
    </Grid>
  );
};

export default FieldWrapper;
