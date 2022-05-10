import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import { useStyles } from './UploadKeyStore.styles';
import ImportValidator from '~app/components/RegisterValidatorHome/components/ImportValidator';

const UploadKeyStore = () => {
    const classes = useStyles();
    // @ts-ignore
    const { public_key } = useParams();

    return (
      <Grid container className={classes.Wrapper}>
        <WhiteWrapper withBackButton={false} header={'Update Operators for Validator'}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>{public_key}</Typography>
            <ImageDiv image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
            <ImageDiv image={'beacon'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>
        <ImportValidator reUpload />
      </Grid>
    );
};

export default observer(UploadKeyStore);