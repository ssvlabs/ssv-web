import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/applications/Faucet/RequestForSsv/RequestForSsv.styles';

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
        header={'SSV Faucet Goerli Testnet'}
        body={[
          <Grid container className={classes.Wrapper}>
            <Typography className={classes.BlueText}>
              Sorry, unfortunately the faucet has depleted for the time being.
            </Typography>
            <Typography className={classes.Text}>
              Please try again at a later time or  jump to our discord to ask the community for help.
            </Typography>
            <PrimaryButton
              disable={false}
              children={'Go to Discord'}
              withVerifyConnection={false}
              submitFunction={requestForSSV}
              wrapperClass={classes.SubmitButton}
            />
          </Grid>,
        ]}
      />
    );
};

export default observer(SuccessPage);
