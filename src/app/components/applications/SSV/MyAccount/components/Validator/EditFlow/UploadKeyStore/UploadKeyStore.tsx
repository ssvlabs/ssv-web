import React from 'react';
import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { useStyles } from './UploadKeyStore.styles';
import ImportFile from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';

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