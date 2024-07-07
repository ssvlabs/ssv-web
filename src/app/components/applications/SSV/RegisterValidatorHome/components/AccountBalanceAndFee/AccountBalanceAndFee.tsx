import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import LinkText from '~app/components/common/LinkText';
import { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import validatorRegistrationFlow from '~app/hooks/useValidatorRegistrationFlow';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/AccountBalanceAndFee/AccountBalanceAndFee.styles';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook.ts';
import { getIsClusterSelected } from '~app/redux/account.slice.ts';
import { BulkActionRouteState } from '~app/Routes';

const AccountBalanceAndFee = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location: Location<BulkActionRouteState> = useLocation();
  const { getNextNavigation } = validatorRegistrationFlow(location.pathname);
  const isSecondRegistration = useAppSelector(getIsClusterSelected);
  const [firstCheckBox, setFirstCheckBox] = useState(false);
  const [secondCheckBox, setSecondCheckBox] = useState(false);

  const sendAnalytics = (link: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'validator_register',
      action: 'link',
      label: link
    });
  };

  const MainScreen = (
    <BorderScreen
      blackHeader
      withoutNavigation={isSecondRegistration}
      header={translations.VALIDATOR.BALANCE_AND_FEE.TITLE}
      body={[
        <Grid container>
          <Grid item container className={classes.bodyTextWrapper}>
            {translations.VALIDATOR.BALANCE_AND_FEE.BODY_TEXT.map((text: string) => {
              return (
                <Grid item className={classes.bodyText} key={text}>
                  {text}
                </Grid>
              );
            })}
          </Grid>

          <Grid item container className={classes.ErrorTextWrapper}>
            <Grid className={classes.ErrorText}>
              Clusters with insufficient balance are at risk of being{' '}
              <LinkText
                style={{ fontSize: 14 }}
                onClick={() => sendAnalytics('https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations')}
                text={'liquidated'}
                link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'}
              />
              , which will result in inactivation (
              <LinkText
                style={{ fontSize: 14 }}
                onClick={() => sendAnalytics('https://docs.ssv.network/learn/glossary#staking')}
                text={'penalties on the beacon chain'}
                link={'https://launchpad.ethereum.org/en/faq#responsibilities'}
              />
              ) of their validators, as they will no longer be operated by the network.
            </Grid>
          </Grid>
          <Checkbox
            grayBackGround
            toggleIsChecked={() => setFirstCheckBox(!firstCheckBox)}
            isChecked={firstCheckBox}
            text={'I understand that fees might change according to market dynamics'}
          />
          <Checkbox
            grayBackGround
            toggleIsChecked={() => setSecondCheckBox(!secondCheckBox)}
            isChecked={secondCheckBox}
            text={'I understand the risks of having my cluster liquidated'}
          />
          <PrimaryButton
            isDisabled={!firstCheckBox || !secondCheckBox}
            text={'Next'}
            onClick={() => {
              navigate(getNextNavigation(), { state: location.state });
            }}
            size={ButtonSize.XL}
          />
        </Grid>
      ]}
    />
  );

  if (isSecondRegistration) {
    return (
      <Grid container>
        <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} />
        {MainScreen}
      </Grid>
    );
  }

  return MainScreen;
};
export default AccountBalanceAndFee;
