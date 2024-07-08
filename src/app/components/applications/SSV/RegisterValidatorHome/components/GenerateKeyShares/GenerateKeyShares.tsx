import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import useValidatorRegistrationFlow, { EValidatorFlowAction } from '~app/hooks/useValidatorRegistrationFlow';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/GenerateKeyShares/GenerateKeyShares.styles';
import { translations } from '~app/common/config';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsMainnet } from '~app/redux/wallet.slice';
import { SecondaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { getIsClusterSelected } from '~app/redux/account.slice.ts';

type ButtonData = {
  isShow: boolean;
  subText?: string;
  wrapperProps: {
    className: string;
  };
  buttonProps: {
    size: ButtonSize;
    text: string;
    onClick: Function;
    withoutBackgroundColor?: boolean;
  };
};

const GenerateKeyShares = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const { networkId } = getStoredNetwork();
  const validatorStore: ValidatorStore = stores.Validator;
  const classes = useStyles({ networkId });
  const { getNextNavigation } = useValidatorRegistrationFlow(window.location.pathname);
  const isMainnet = useAppSelector(getIsMainnet);
  const isSecondRegistration = useAppSelector(getIsClusterSelected);

  const buttonsData: ButtonData[] = [
    {
      isShow: !isMainnet,
      subText: translations.VALIDATOR.GENERATE_KEY_SHARES.SPLIT_VIA_WEB_APP,
      wrapperProps: {
        className: classes.LinkButtonWrapper
      },
      buttonProps: {
        size: ButtonSize.XL,
        // dataTestId: translations.VALIDATOR.GENERATE_KEY_SHARES.ONLINE.toLowerCase(),
        text: translations.VALIDATOR.GENERATE_KEY_SHARES.ONLINE,
        onClick: () => {
          validatorStore.keyStoreFile = null;
          nextPage(EValidatorFlowAction.GENERATE_KEY_SHARES_ONLINE);
        }
      }
    },
    {
      isShow: true,
      subText: translations.VALIDATOR.GENERATE_KEY_SHARES.SPLIT_ON_COMPUTER,
      wrapperProps: {
        className: classes.LinkButtonWrapper
      },
      buttonProps: {
        size: ButtonSize.XL,
        // dataTestId: translations.VALIDATOR.GENERATE_KEY_SHARES.OFFLINE.toLowerCase(),
        text: translations.VALIDATOR.GENERATE_KEY_SHARES.OFFLINE,
        onClick: () => {
          validatorStore.keyShareFile = null;
          nextPage(EValidatorFlowAction.GENERATE_KEY_SHARES_OFFLINE);
        }
      }
    },
    {
      isShow: isSecondRegistration,
      wrapperProps: {
        className: `${classes.LinkButtonWrapper} ${classes.SecondRegistrationExistKeyShares}`
      },
      buttonProps: {
        size: ButtonSize.XL,
        // dataTestId: 'secondRegister',
        withoutBackgroundColor: true,
        text: translations.VALIDATOR.GENERATE_KEY_SHARES.ALREADY_HAVE_KEY_SHARES,
        onClick: () => {
          validatorStore.keyStoreFile = null;
          nextPage(EValidatorFlowAction.SECOND_REGISTER);
        }
      }
    }
  ];

  const nextPage = (mode: EValidatorFlowAction) => {
    navigate(getNextNavigation(mode));
  };

  const MainScreen = (
    <BorderScreen
      withoutNavigation={isSecondRegistration}
      body={[
        <Grid container style={{ gap: 24 }}>
          <HeaderSubHeader
            marginBottom={0.01}
            title={translations.VALIDATOR.GENERATE_KEY_SHARES.GENERATE_KEY_SHARES}
            subtitle={
              <>
                To run a Distributed Validator you must split your validation key into <br />
                <b>Key Shares</b> and distribute them across your selected operators to
                <br />
                operate in your behalf.
              </>
            }
          />
          <Grid item className={classes.Image} />
          <HeaderSubHeader marginBottom={0.01} subtitle={translations.VALIDATOR.GENERATE_KEY_SHARES.SELECT_METHOD} />
          <Grid container item className={classes.LinkButtonsWrapper}>
            {buttonsData
              .filter((buttonData: ButtonData) => buttonData.isShow)
              .map((buttonData: ButtonData, i) => (
                <Grid container item {...buttonData.wrapperProps} key={i}>
                  <SecondaryButton {...buttonData.buttonProps} />
                  {!isSecondRegistration && buttonData.subText && (
                    <Grid item xs={12} className={classes.UnderButtonText}>
                      {buttonData.subText}
                    </Grid>
                  )}
                </Grid>
              ))}
          </Grid>
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
export default observer(GenerateKeyShares);
