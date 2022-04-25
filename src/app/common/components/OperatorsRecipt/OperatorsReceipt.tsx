import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/common/components/Status';
import Tooltip from '~app/common/components/ToolTip/ToolTip';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import PrimaryButton from '~app/common/components/PrimaryButton';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays';
import OperatorDetails from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import { useStyles } from './OperatorsReceipt.style';

type Props = {
    operators: any,
    header?: string,
    currentOperators?: boolean,
};
const OperatorsReceipt = (props: Props) => {
    const stores = useStores();
    const { operators, header, currentOperators } = props;
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const validatorStore: ValidatorStore = stores.Validator;
    const classes = useStyles({ currentOperators });
    walletStore;

    const body = [
      <Grid container item>
        <Grid container item className={classes.OperatorsWrapper}>
          {operators.map((operator: any, index: number) => {
              if (!currentOperators) console.log(Object.keys(operator));
                    return (
                      <Grid key={index} container item xs={12} className={classes.OperatorsDetails}>
                        <Grid item xs>
                          <OperatorDetails operator={operator} gray80={currentOperators} />
                        </Grid>
                        <Grid item>
                          <Status status={operator.status} />
                        </Grid>
                        <Grid item xs>
                          <SsvAndSubTitle gray80={currentOperators} ssv={operator.ssv ?? 0} subText={'/year'} />
                        </Grid>
                      </Grid>
                    );
                })}
          <Grid container item justify={'space-between'}>
            <Grid item xs>
              <Typography className={classes.NetworkYearlyFee} style={{ marginRight: 8 }} component={'span'}>Network yearly fees</Typography>
              <Tooltip text={'Network yearly fee'} />
            </Grid>
            <Grid item>
              <Typography className={classes.NetworkYearlyFee}>{ssvStore.getFeeForYear(ssvStore.networkFee)} SSV</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>,
      <Grid container item justify={'space-between'}>
        <Grid item>
          <Typography className={classes.NetworkYearlyFee}>Total Yearly Fee</Typography>
        </Grid>
        <Grid item>
          <SsvAndSubTitle bold gray80={currentOperators} ssv={ssvStore.getFeeForYear(ssvStore.networkFee)} subText={'~$757.5'} />
        </Grid>
      </Grid>,
      <Grid container item>
        <RemainingDays gray80={currentOperators} />
      </Grid>,
    ];
    if (!currentOperators) body.push(<PrimaryButton text={'Update Operators'} onClick={validatorStore.updateValidator} />);

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
