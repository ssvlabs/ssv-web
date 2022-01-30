import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import OperatorStore from '~app/common/stores/Operator.store';
import ValidatorStore from '~app/common/stores/Validator.store';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import PrimaryButton from '~app/common/components/PrimaryButton';
import { useStyles } from '~app/components/SuccessScreen/SuccessScreen.styles';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import LinkText from '~app/common/components/LinkText';

const SuccessScreen = () => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const { redirectUrl, history } = useUserFlow();
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    let icon: string = '';
    let subTitle: any = '';
    let buttonText: string = '';
    let surveyLink: string = '';
    let monitorText: any = '';

    if (operatorStore.newOperatorRegisterSuccessfully) {
        icon = 'operator';
        buttonText = process.env.REACT_APP_NEW_STAGE ? 'Monitor Operator' : 'View Operator';
        subTitle = (
          <Grid container>
            <Grid item>Your operator has been successfully registered!</Grid>
            <Grid item>With every new operator, our network grows stronger.</Grid>
          </Grid>
        );
        if (process.env.REACT_APP_NEW_STAGE) {
            monitorText = 'View your operator\'s prefomance and manage it in the account dashboard';
        } else {
            monitorText = (
              <Grid container spacing={3}>
                <Grid item>
                  Jump into our documentation to learn more
                  about <LinkText text={'monitoring'} link={'https://docs.ssv.network/operators/installation-operator-1/operators-grafana-dashboard '} /> and <LinkText text={'troubleshooting'} link={'https://docs.ssv.network/operators/installation-operator-1/node-troubleshooting-faq'} /> your node.
                </Grid>
                <Grid item>
                  View your operators prefomance the ssv network explorer.
                </Grid>
              </Grid>
            );
        }

        surveyLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeTPm6imiND4kja5mmnnjZ6iRcuocebGrIMhvm1rVtM7ZtrCA/viewform';
    } else if (validatorStore.newValidatorReceipt) {
        icon = 'validator';
        buttonText = process.env.REACT_APP_NEW_STAGE ? 'Manage Validator' : 'View Validator';
        subTitle = translations.SUCCESS.VALIDATOR_DESCRIPTION;
        monitorText = 'View and mange your balance and validators in your account dashboard';
        surveyLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeOcsFJ20f1VFhqZ8rbqGdEsyvS8xdqpBC2aTc7VTVhqFfWQw/viewform';
    }

    const redirectTo = async () => {
        if (process.env.REACT_APP_NEW_STAGE) {
            await operatorStore.loadOperators(true);
            await walletStore.initializeUserInfo();
            history.push(config.routes.MY_ACCOUNT.DASHBOARD);
        } else {
            let linkToExplorer: string = '';
            if (validatorStore.newValidatorReceipt) {
                linkToExplorer = `${config.links.LINK_EXPLORER}/validators/${validatorStore.newValidatorReceipt.replace('0x', '')}`;
            }
            if (operatorStore.newOperatorRegisterSuccessfully) {
                linkToExplorer = `${config.links.LINK_EXPLORER}/operators/${operatorStore.newOperatorRegisterSuccessfully}`;
            }
            window.open(linkToExplorer);
        }
    };

    const takeSurvey = () => {
        window.open(surveyLink);
        localStorage.setItem('firstCreation', 'true');
    };

    return (
      <>
        <BorderScreen
          blackHeader
          sectionClass={classes.SectionWrapper}
          header={translations.SUCCESS.TITLE}
          body={[
            <Grid item container>
              <Grid item className={`${classes.Text} ${classes.SubHeader}`}>{subTitle}</Grid>
              <Grid item className={`${classes.SuccessLogo} ${icon === 'operator' ? classes.Operator : classes.Validator}`} />
              <Grid item className={`${classes.Text} ${classes.SubImageText}`}>{monitorText}</Grid>
              <PrimaryButton text={buttonText} onClick={redirectTo} />
            </Grid>,
          ]}
        />
        {!localStorage.getItem('firstCreation') && (
          <BorderScreen
            blackHeader
            withoutNavigation
            wrapperClass={classes.FeedbackWrapper}
            sectionClass={classes.FeedbackSection}
            header={translations.SUCCESS.FEEDBACK_HEADER}
            body={[
              <Grid item container>
                <Grid container item className={classes.Feedback}>
                  <Grid item className={`${classes.Text} ${classes.SubHeader}`}>In order to improve and optimize, open sourced networks thrive on feedback and peer review.</Grid>
                  <PrimaryButton wrapperClass={classes.CtaWrapper} text={'Take the survey'} onClick={takeSurvey} />
                </Grid>
              </Grid>,
            ]}
          />
        )}
      </>
    );
};

export default observer(SuccessScreen);
