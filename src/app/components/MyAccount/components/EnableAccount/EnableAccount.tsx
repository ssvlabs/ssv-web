import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
// import CTAButton from '~app/common/components/CTAButton';
import { useStyles } from './EnableAccount.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import config from '~app/common/config';
import NameAndAddress from '~app/common/components/NameAndAddress';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ValidatorDropDownMenu from '~app/components/MyAccount/components/EnableAccount/Components/ValidatorDropDownMenu/ValidatorDropDownMenu';
import LinkText from '~app/common/components/LinkText/LinkText';

const EnableAccount = () => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const { redirectUrl, history } = useUserFlow();
    const [allOperatorsFee, setTotalFee] = useState(0);
    const networkYearlyFees = ssvStore.getFeeForYear(ssvStore.networkFee);
    const liquidationCollateral = (ssvStore.networkFee + allOperatorsFee / config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR) * ssvStore.liquidationCollateral;
    const totalFee = allOperatorsFee + networkYearlyFees + liquidationCollateral;
    const summaryFields = [
        { name: 'Operators yearly fee', value: allOperatorsFee },
        { name: 'Network yearly fee', value: formatNumberToUi(networkYearlyFees) },
        { name: 'Liquidation collateral', value: formatNumberToUi(liquidationCollateral) },
    ];

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    useEffect(() => {

    }, []);

    const unableAccount = (fee: any) => {
        ssvStore.activateValidator(fee);
    };
    unableAccount;

    return (
      <div>
        <BorderScreen
          header={'Enable Account'}
          sectionClass={classes.Section}
          body={[
              (
                <Grid container>
                  <Grid item container className={classes.WarningWrapper}>
                    <Grid item>
                      Your account has been <a href={'www.bla.com'}>liquidated</a> due to insufficient balance
                      for
                      its maintenance. If you would like to resume its operations, you must deposit sufficient
                      balance required for reactivation.
                    </Grid>
                    <Grid item>
                      <LinkText text={'Read more on account reactivation'} link={'www.bla.com'} />
                    </Grid>
                  </Grid>
                  <Grid item container>
                    <Grid item className={classes.OperatorsTitle}>
                      Operators Fees Details
                    </Grid>
                    <Grid item container>
                      {[].map((publicKey: any, index: number) => {
                            return (
                              <ValidatorDropDownMenu
                                key={index}
                                index={index}
                                setTotalFee={setTotalFee}
                                validatorPublicKey={publicKey}
                                allOperatorsFee={allOperatorsFee}
                              />
                            );
                        })}
                    </Grid>
                  </Grid>
                </Grid>
              ), (
                <Grid container>
                  <Grid item container>
                    <Grid item className={classes.SummaryTitle}>
                      Transaction Summary
                    </Grid>
                    {summaryFields.map((field: any, index: number) => {
                              return (
                                <Grid key={index} item container className={classes.SummaryField}>
                                  <Grid item>
                                    <NameAndAddress name={field.name} />
                                  </Grid>
                                  <Grid item>
                                    <NameAndAddress name={`${field.value} SSV`} />
                                  </Grid>
                                </Grid>
                              );
                          })}
                  </Grid>
                </Grid>
              ),
          ]}
          bottom={(
            <Grid container item justify={'space-between'}>
              <Grid item>
                <NameAndAddress name={'Total'} />
              </Grid>
              <Grid item className={classes.AlignRight}>
                <SsvAndSubTitle bold ssv={formatNumberToUi(totalFee)} subText={'~$490'} />
              </Grid>
              <Grid item>
                {/* <CTAButton text={'Enable Account'} disable={false} onClick={() => { unableAccount(totalFee); }} withAllowance /> */}
              </Grid>
            </Grid>
          )}
        />
      </div>
    );
};

export default observer(EnableAccount);