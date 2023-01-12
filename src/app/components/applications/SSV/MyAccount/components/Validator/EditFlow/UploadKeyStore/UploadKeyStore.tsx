import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from './UploadKeyStore.styles';
import ImportFile from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';

const UploadKeyStore = () => {
    const classes = useStyles();

    return (
      <Grid container className={classes.Wrapper}>
        <ValidatorWhiteHeader withCancel withBackButton={false} text={'Update Operators for Validator'} />
        <ImportFile reUpload />
      </Grid>
    );
};

export default observer(UploadKeyStore);