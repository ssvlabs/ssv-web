import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import WhiteWrapper from '~app/components/common/WhiteWrapper';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
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
  const validatorStore: ValidatorStore = stores.Validator;
  const notificationsStore: NotificationsStore = stores.Notifications;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.address ?? validatorStore.processValidatorPublicKey);
    notificationsStore.showMessage('Copied to clipboard.', 'success');
  };

  const openExplorer = () => {
    if (props.address) {
      GoogleTagManager.getInstance().sendEvent({
        category: 'explorer_link',
        action: 'click',
        label: 'operator',
      });
      window.open(`${config.links.LINK_EXPLORER}/operators/${props.address}`, '_blank');
    } else {
      GoogleTagManager.getInstance().sendEvent({
        category: 'explorer_link',
        action: 'click',
        label: 'validator',
      });
      window.open(`${config.links.LINK_EXPLORER}/validators/${validatorStore.processValidatorPublicKey.replace('0x', '')}`, '_blank');
    }
  };

  const openBeaconcha = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha',
    });
    window.open(`${beaconchaBaseUrl}/validator/${validatorStore.processValidatorPublicKey}`);
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
        <Typography>{props.address ?? validatorStore.processValidatorPublicKey}</Typography>
        <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
        {!props.withoutExplorer && <ImageDiv onClick={openExplorer} image={'explorer'} width={24} height={24} />}
        {!props.withoutBeaconcha && <ImageDiv onClick={openBeaconcha} image={'beacon'} width={24} height={24} />}
      </Grid>
    </WhiteWrapper>
  );
};

export default observer(ValidatorWhiteHeader);
