import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import WhiteWrapper from '~app/components/common/WhiteWrapper';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import ProcessStore, { SingleValidatorProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader/ValidatorWhiteHeader.styles';

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
  const beaconchaBaseUrl = getBaseBeaconchaUrl();
  const processStore: ProcessStore = stores.Process;
  const notificationsStore: NotificationsStore = stores.Notifications;
  const process: SingleValidatorProcess = processStore.getProcess;
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
      window.open(`${config.links.EXPLORER_URL}/operators/${props.address}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`, '_blank');
    } else {
      GoogleTagManager.getInstance().sendEvent({
        category: 'explorer_link',
        action: 'click',
        label: 'validator',
      });
      window.open(`${config.links.EXPLORER_URL}/validators/${validator.public_key.replace('0x', '')}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`, '_blank');
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
  // console.log(props.withBackButton);

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
