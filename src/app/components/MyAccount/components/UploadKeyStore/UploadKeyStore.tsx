import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Typography from '@material-ui/core/Typography';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import ImportValidator from '~app/components/RegisterValidatorHome/components/ImportValidator';
import { useStyles } from './UploadKeyStore.styles';

const UploadKeyStore = () => {
    const classes = useStyles();
    const stores = useStores();
    // @ts-ignore
    const { public_key } = useParams();
    const notificationsStore: NotificationsStore = stores.Notifications;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(public_key);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    return (
      <Grid container className={classes.Wrapper}>
        <WhiteWrapper withCancel withBackButton={false} header={'Update Operators for Validator'}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>{public_key}</Typography>
            <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
            <ImageDiv image={'beacon'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>
        <ImportValidator reUpload />
      </Grid>
    );
};

export default observer(UploadKeyStore);