import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import WhiteWrapper from '~app/components/common/WhiteWrapper';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/common/ValidatorWhiteHeader/ValidatorWhiteHeader.styles';
import { getLinks } from '~root/providers/networkInfo.provider';

type Props = {
  text: string,
  address?: string,
  withCancel?: boolean,
  withBackButton?: boolean,
  withoutExplorer?: boolean,
  withoutBeaconcha?: boolean,
  onCancelButtonClick?: () => void | null | undefined;
};

const ValidatorWhiteHeader = (props: Props) => {
  const stores = useStores();
  const classes = useStyles();
  const beaconchaBaseUrl = getLinks().BEACONCHA_URL;
  const processStore: ProcessStore = stores.Process;
  const notificationsStore: NotificationsStore = stores.Notifications;
  const process: SingleCluster = processStore.getProcess;
  const validator = process?.item;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.address ?? validator.public_key);
    notificationsStore.showMessage('Copied to clipboard.', 'success');
  };

  const openExplorer = () => {
    if (props.address) {
      GoogleTagManager.getInstance().sendEvent({
        category: 'explorer_link',
        action: 'click',
        label: 'operator',
      });
      window.open(`${config.links.EXPLORER_URL}/operators/${props.address}`, '_blank');
    } else {
      GoogleTagManager.getInstance().sendEvent({
        category: 'explorer_link',
        action: 'click',
        label: 'validator',
      });
      window.open(`${config.links.EXPLORER_URL}/validators/${validator.public_key.replace('0x', '')}`, '_blank');
    }
  };

  const openBeaconcha = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha',
    });
    window.open(`${beaconchaBaseUrl}/validator/${validator.public_key}`);
  };

  return (
    <WhiteWrapper
      withCancel={!!props.withCancel}
      withBackButton={props.withBackButton}
      header={props.text}
      backButtonCallBack={props.onCancelButtonClick}
    >
      <Grid item container className={classes.SubHeaderWrapper}>
        <Typography>{props.address ?? validator.public_key}</Typography>
        <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
        {!props.withoutExplorer && <ImageDiv onClick={openExplorer} image={'explorer'} width={24} height={24} />}
        {!props.withoutBeaconcha && <ImageDiv onClick={openBeaconcha} image={'beacon'} width={24} height={24} />}
      </Grid>
    </WhiteWrapper>
  );
};

export default observer(ValidatorWhiteHeader);
