import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import CheckBox from '~app/components/common/CheckBox';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import WhiteWrapper from '~app/components/common/WhiteWrapper/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/Operator/common/OperatorId';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/RemoveOperator/RemoveOperator.styles';

const RemoveOperator = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const [operator, setOperator] = useState(null);
  const [checkbox, setCheckBox] = useState(false);
  const [leavingReason, setLeavingReason] = useState(0);
  const [userTextReason, setUserTextReason] = useState('');
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;
  const classes = useStyles({ leavingReason, isLoading: applicationStore.isLoading });

  useEffect(() => {
    if (!operatorStore.processOperatorId) return navigate(applicationStore.strategyRedirect);
    applicationStore.setIsLoading(true);
    Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
      if (response) {
        setOperator(response);
        applicationStore.setIsLoading(false);
      }
    });
  }, []);

  const chooseReason = (reason: number) => {
    if (leavingReason === reason) {
      setCheckBox(false);
      setLeavingReason(0);
    } else {
      setLeavingReason(reason);
    }
  };

  const inputHandler = (e: any) => {
    const userInput = e.target.value;
    setUserTextReason(userInput);
  };

  const sendLinkClickedAnalytics = (link: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'validator_register',
      action: 'link',
      label: link,
    });
  };

  const outDocumentationLink = 'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations';

  const ShareWithUsText = () => {
    switch (leavingReason) {
      case 1:
        return (
          <Grid item className={classes.ShareWithUsBulletsPoints}>
            <ul>
              <li>Visit <LinkText onClick={() => sendLinkClickedAnalytics(outDocumentationLink)}
                text={'our documentation'}
                link={outDocumentationLink} /> for common node
                troubleshooting.
              </li>
              <li>Consult with other experiences operators in our <LinkText
                onClick={() => sendLinkClickedAnalytics('https://discord.gg/AbYHBfjkDY')}
                text={'discord developer community'} link={'https://discord.gg/AbYHBfjkDY'} />.
              </li>
            </ul>
          </Grid>
        );
      case 2:
        return (
          <Grid item className={classes.ShareWithUsBulletsPoints}>
            <ul>
              <li>Business is slow? Increase your traction and reputation by <LinkText
                text={'becoming a verified operator.'}
                link={'https://forum.ssv.network/t/dao-curated-node-registry-verified-operators/129'} />
              </li>
              {/* <li>Costs are too high? See our guides on how to <LinkText text={'optimize hosting costs.'} link={'blat'} /> */}
              {/* </li> */}
            </ul>
          </Grid>
        );
      default:
        return null;
    }
  };

  const shareWithUs = () => {
    if (leavingReason === 0) return null;

    return (
      <Grid container item className={classes.ShareWithUsWrapper}>
        <ShareWithUsText />
        <TextInput
          disable={false}
          value={userTextReason}
          data-testid="leaving reason"
          onChangeCallback={inputHandler}
          wrapperClass={classes.InputWrapper}
          placeHolder={'Share with us what went wrong'}
        />
      </Grid>
    );
  };

  const checkboxHandler = () => {
    setCheckBox(!checkbox);
  };

  const submitForm = async () => {
    const reasons: any = { 1: 'Technical Issues', 2: 'Low profitability', 3: 'Other' };
    GoogleTagManager.getInstance().sendEvent({
      category: 'remove_feedback',
      action: reasons[leavingReason],
      label: userTextReason,
    });
    applicationStore.setIsLoading(true);
    const isRemoved = await operatorStore.removeOperator(Number(operatorStore.processOperatorId));
    applicationStore.setIsLoading(false);
    if (isRemoved) navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.REMOVE.SUCCESS);
  };

  // @ts-ignore
  const { id } = operator || {};

  if (!operator) return null;

  return (
    <Grid container item>
      <WhiteWrapper backButtonCallBack={() => {
        GoogleTagManager.getInstance().sendEvent({
          category: 'remove',
          action: 'back',
        });
      }} header={'Remove Operator'}>
        <OperatorId id={id} />
      </WhiteWrapper>
      <Grid className={classes.BodyWrapper}>
        <BorderScreen
          blackHeader
          withoutNavigation
          header={'Removing your operator will:'}
          body={[
            <Grid container item>
              <Grid item className={classes.BulletsWrapper}>
                <ul>
                  <li>Terminate operation of all your managed validators, which will reduce their fault tolerance and
                    put them at risk.
                  </li>
                  <li>Immediately stop receiving future earnings from validators operation.</li>
                  <li>Remove yourself from the network and you will not longer be discoverable by other validators.</li>
                  <li>Will delete all validators keyshares from your operator node.</li>
                </ul>
              </Grid>
              <Grid item className={classes.Notice}>
                Please note that this process is irreversible and you would not be able to reactive this operator in the
                future.
              </Grid>
              <Typography className={classes.TextHelper}>Help us understand why you are leaving:</Typography>
              <Grid container item className={classes.BoxesWrapper}>
                <Grid item container className={classes.BoxWrapper} onClick={() => {
                  chooseReason(1);
                }}>
                  <Grid item className={classes.TechnicalImage} xs={12}></Grid>
                  Technical Issues
                </Grid>
                <Grid item container className={classes.BoxWrapper} onClick={() => {
                  chooseReason(2);
                }}>
                  <Grid item className={classes.ProfitabilityImage} xs={12}></Grid>
                  Low profitability
                </Grid>
                <Grid item container className={classes.BoxWrapper} onClick={() => {
                  chooseReason(3);
                }}>
                  <Grid item className={classes.OtherImage} xs={12}></Grid>
                  Other
                </Grid>
              </Grid>
              {shareWithUs()}
              {leavingReason !== 0 && (
                <CheckBox onClickCallBack={checkboxHandler}
                  text={'I understand that by removing my operator I am potentially putting all of my managed validators at risk.'} />
              )}

              <PrimaryButton disable={!checkbox || leavingReason === 0} errorButton text={'Submit & Remove'}
                submitFunction={submitForm} />
            </Grid>,
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default observer(RemoveOperator);
