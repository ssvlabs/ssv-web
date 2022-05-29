import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import PrimaryButton from '~app/common/components/Button/PrimaryButton';
import { useStyles } from '~app/components/SuccessScreen/SuccessScreen.styles';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';

const SuccessScreen = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const walletStore: WalletStore = stores.Wallet;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const buttonText = process.env.REACT_APP_NEW_STAGE ? 'Manage Validator' : 'View Validator';

    const redirectTo = async () => {
        applicationStore.setIsLoading(true);
        if (process.env.REACT_APP_NEW_STAGE) {
            await walletStore.initializeUserInfo();
            Validator.getInstance().clearValidatorCache();
            setTimeout(() => {
                applicationStore.setIsLoading(false);
                history.push(config.routes.MY_ACCOUNT.DASHBOARD);
            }, 7000);
        } else {
            const linkToExplorer: string = `${config.links.LINK_EXPLORER}/validators/${validatorStore.newValidatorReceipt.replace('0x', '')}`;
            window.open(linkToExplorer);
        }
    };
    // const linkToExchange = (url: string) => {
    //     window.open(url);
    // };

    return (
      <>
        <BorderScreen
          blackHeader
          withoutNavigation
          borderRadius={'16px 16px 0px 0px'}
          header={translations.SUCCESS.TITLE}
          sectionClass={classes.SectionWrapper}
          body={[
            <Grid item container className={classes.Wrapper}>
              <Grid item className={classes.BackgroundImage} />
              <Grid item className={classes.Text}>Your validator is now running on the secured and distributed infrastructure <br /> of our network.</Grid>
              <Grid item className={classes.Text}>Your chosen operators have been notified and instantly started their <br /> operation.</Grid>
              <Grid item className={classes.Text}>To manage your account and validator enter your account dashboard.</Grid>
              <PrimaryButton text={buttonText} submitFunction={redirectTo} />
            </Grid>,
          ]}
        />
        {/* <BorderScreen */}
        {/*  borderRadius={'0 0 16px 16px'} */}
        {/*  wrapperClass={classes.Incentivized} */}
        {/*  withoutNavigation */}
        {/*  body={[ */}
        {/*    <Grid container item> */}
        {/*      <Typography className={classes.IncentivizedTitle}>The &apos;Primus&apos; Incentivized Testnet is Live</Typography> */}
        {/*      <Typography className={classes.IncentivizedSubTitle}> */}
        {/*        All eligible validators will receive SSV rewards for participation */}
        {/*        <LinkText link={'https://snapshot.org/#/mainnet.ssvnetwork.eth/proposal/QmSbouw5SCUmKMQwW7s1bEwhfXJ9LQJHetsruU8MrUTwBE'} text={'(conditions)'} /> */}
        {/*      </Typography> */}
        {/*      <Typography className={classes.IncentivizedSmallHeader}>Stakers Earn More</Typography> */}
        {/*      <Typography className={classes.IncentivizedSubTitle}> */}
        {/*        Validators who also <b>stake SSV</b> tokens are generating <b>over x5 more rewards</b> comparing to non staking validators. */}
        {/*      </Typography> */}
        {/*      <Typography className={classes.IncentivizedSmallHeader}>Get SSV tokens</Typography> */}
        {/*      <Grid container item className={classes.IncentivizedLogos} justify={'space-between'}> */}
        {/*        <Grid item onClick={() => { linkToExchange('https://coinmarketcap.com/currencies/ssv-network/'); }} /> */}
        {/*        <Grid item onClick={() => { linkToExchange('https://www.binance.com/en/trade/SSV_BTC'); }} /> */}
        {/*        <Grid item onClick={() => { linkToExchange('https://www.gate.io/trade/SSV_USDT'); }} /> */}
        {/*        <Grid item onClick={() => { linkToExchange('https://app.uniswap.org/'); }} /> */}
        {/*        <Grid item onClick={() => { linkToExchange('https://www.mexc.com/exchange/SSV_USDT'); }} /> */}
        {/*        <Grid item onClick={() => { linkToExchange('https://www.xt.com/trade/ssv_usdt/'); }} /> */}
        {/*      </Grid> */}
        {/*      <Typography className={classes.IncentivizedSubTitle}> */}
        {/*        To receive staking rewards you must hold SSV tokens with the same wallet address that you used to register your validator to the network. */}
        {/*      </Typography> */}
        {/*    </Grid>, */}

        {/*  ]} */}
        {/* /> */}
      </>
    );
};

export default observer(SuccessScreen);
