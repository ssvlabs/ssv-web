import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import ImportFile from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/ValidatorWhiteHeader';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/UploadKeyStore/UploadKeyStore.styles';


const UploadKeyStore = () => {
    const classes = useStyles();

    return (
      <Grid container className={classes.Wrapper}>
        <ValidatorWhiteHeader withCancel withBackButton={false} text={'Update Operators for Validator'} />
        <ImportFile type={1} />
      </Grid>
    );
};

export default observer(UploadKeyStore);