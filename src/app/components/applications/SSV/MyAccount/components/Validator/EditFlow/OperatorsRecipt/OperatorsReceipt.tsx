import React from 'react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import Button from '~app/components/common/Button';
import LinkText from '~app/components/common/LinkText';
import Checkbox from '~app/components/common/CheckBox';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import { addNumber, formatNumberToUi } from '~lib/utils/numbers';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import RemainingDays from '~app/components/applications/SSV/MyAccount/common/RemainingDays';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/OperatorsRecipt/OperatorsReceipt.style';
import { fromWei } from '~root/services/conversions.service';

type Props = {
  operators: any,
  header?: string,
  previousOperators?: any,
  currentOperators?: boolean,
};
const OperatorsReceipt = (props: Props) => {
  const stores = useStores();
  const navigate = useNavigate();
  const location: any = useLocation();
  const { operators, header, previousOperators, currentOperators } = props;
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const classes = useStyles({ currentOperators });
  const [checked, setChecked] = React.useState(false);
  const [openRedirect, setOpenRedirect] = React.useState(false);

  if (location.state?.success) {
    location.state = null;
    setOpenRedirect(true);
    setTimeout(() => {
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT);
    }, 10000);
  }

  const oldOperatorsFee = previousOperators?.reduce(
    (previousValue: number, currentValue: IOperator) => previousValue + fromWei(currentValue.fee),
    0,
  );

  const newOperatorsFee = operators.reduce(
    (previousValue: number, currentValue: IOperator) => {
      if (currentValue.ownerAddress !== walletStore.accountAddress) {
        // eslint-disable-next-line no-param-reassign
        previousValue += fromWei(currentValue.fee);
      }
      return previousValue;
    }, 0,
  );

  const networkFee = ssvStore.getFeeForYear(ssvStore.networkFee, 11);
  const operatorsYearlyFee = ssvStore.getFeeForYear(newOperatorsFee);
  const remainingDays = ssvStore.getRemainingDays({ newBurnRate: ssvStore.getNewAccountBurnRate(oldOperatorsFee, newOperatorsFee) });

  const checkBox = () => {
    // @ts-ignore
    if (remainingDays < 30 && remainingDays !== 0) {
      return (
        <Checkbox
          disable={false}
          text={'I understand the risks of having my account liquidated'}
          onClickCallBack={() => {
            setChecked(!checked);
          }}
        />
      );
    }
    return null;
  };

  const updateValidator = async () => {
    applicationStore.setIsLoading(true);
    const response = await validatorStore.updateValidator();
    if (response) {
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_UPDATE.SUCCESS);
      setTimeout(() => {
        navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT);
      }, 10000);
    }
  };

  const body = [
    <Grid container item>
      <Grid container item className={classes.OperatorsWrapper}>
        <Dialog
          open={openRedirect}
          PaperProps={{
            style: { borderRadius: 16, backgroundColor: 'transparent' },
          }}
        >
          <Grid className={classes.DialogWrapper}>
            <HeaderSubHeader
              title={'Your Validator Has been Updated'}
              subtitle={'You are being redirected to your validator'}
            />
            <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
          </Grid>
        </Dialog>
        {operators.map((operator: any, index: number) => {
          return (
            <Grid key={index} container item xs={12} className={classes.OperatorsDetails}>
              <Grid item xs>
                <OperatorDetails operator={operator} gray80={currentOperators} />
              </Grid>
              <Grid item>
                <Status item={operator} />
              </Grid>
              <Grid item xs>
                <SsvAndSubTitle gray80={currentOperators}
                  ssv={formatNumberToUi(ssvStore.getFeeForYear(fromWei(operator.fee)))}
                  subText={'/year'} />
              </Grid>
            </Grid>
          );
        })}
        <Grid container item style={{ justifyContent: 'space-between' }}>
          <Grid item xs>
            <Typography className={classes.NetworkYearlyFee} style={{ marginRight: 8 }} component={'span'}>Network yearly
              fees</Typography>
            <Tooltip
              text={(
                <>
                  Fees charged for using the network.
                  Fees are determined by the DAO and are used for network growth
                  and expansion.&nbsp;
                  <LinkText
                    text={'Read more'}
                    link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/fees'}
                  /> on fees.
                </>
              )}
            />
          </Grid>
          <Grid item>
            <Typography className={classes.NetworkYearlyFee}>{formatNumberToUi(networkFee)} SSV</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>,
    <Grid container item style={{ justifyContent: 'space-between' }}>
      <Grid item>
        <Typography className={classes.NetworkYearlyFee}>Total Yearly Fee</Typography>
      </Grid>
      <Grid item>
        <SsvAndSubTitle bold gray80={currentOperators}
          ssv={formatNumberToUi(addNumber(networkFee, operatorsYearlyFee).toFixed())} />
      </Grid>
    </Grid>,
    <Grid container item>
      <RemainingDays
        gray80={currentOperators}
        disableWarning={currentOperators}
        operatorChange={!currentOperators}
        newBurnRate={!currentOperators ? ssvStore.getNewAccountBurnRate(oldOperatorsFee, newOperatorsFee) : undefined}
      />
    </Grid>,
  ];

  if (!currentOperators) {
    body.push(
      <Grid item xs>
        {checkBox()}
        <Button
          // @ts-ignore
          text={'Update Operators'}
          onClick={updateValidator}
          // @ts-ignore
          disable={remainingDays === 0 || (remainingDays < 30 && !checked)}
        />
      </Grid>,
    );
  }

  return (
    <BorderScreen
      body={body}
      header={header}
      withoutNavigation
      gray80={currentOperators}
      blackHeader={!currentOperators}
      sectionClass={classes.SectionWrapper}
    />
  );
};

export default OperatorsReceipt;
