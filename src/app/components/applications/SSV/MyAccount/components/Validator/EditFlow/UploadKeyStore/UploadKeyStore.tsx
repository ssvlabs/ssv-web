import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import ImportValidator from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportValidator';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import { useStyles } from './UploadKeyStore.styles';

const UploadKeyStore = () => {
    const classes = useStyles();

    return (
      <Grid container className={classes.Wrapper}>
        <ValidatorWhiteHeader withCancel withBackButton={false} text={'Update Operators for Validator'} />
        <ImportValidator reUpload />
      </Grid>
    );
};

export default observer(UploadKeyStore);