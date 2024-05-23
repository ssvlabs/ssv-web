import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import { useStyles } from '~app/components/applications/Faucet/RequestForSsv/RequestForSsv.styles';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const SuccessPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const requestForSSV = () => {
    navigate(config.routes.FAUCET.SUCCESS);
  };

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      header={'SSV Faucet Holesky Testnet'}
      body={[
        <Grid container className={classes.Wrapper}>
          <Typography className={classes.BlueText}>Sorry, unfortunately the faucet has depleted for the time being.</Typography>
          <Typography className={classes.Text}>Please try again at a later time or jump to our discord to ask the community for help.</Typography>
          <PrimaryButton text={'Go to Discord'} onClick={requestForSSV} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default observer(SuccessPage);
