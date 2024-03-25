import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/OperatorId/OperatorId.styles';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { useAppDispatch } from '~app/hooks/redux.hook';

type Props = {
  id: number,
  text?: string,
  successPage?: boolean,
  withoutExplorer?: boolean,
};

const OperatorId = ({ id, text, successPage, withoutExplorer }: Props) => {
  const classes = useStyles({ successPage });
  const dispatch = useAppDispatch();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(id));
    dispatch(setMessageAndSeverity({ message: 'Copied to clipboard.', severity: 'success' }));
  };

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator',
    });
    window.open(`${config.links.EXPLORER_URL}/operators/${id}`, '_blank');
  };

  return (
    <Grid item container className={classes.Wrapper}>
      <Typography className={classes.OperatorId}>{text ?? successPage ? 'ID' : 'Operator ID'}: {id}</Typography>
      <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
      {!withoutExplorer && <ImageDiv onClick={openExplorer} image={'explorer'} width={24} height={24} />}
    </Grid>
  );
};

export default OperatorId;
