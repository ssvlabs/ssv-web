import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import ToolTip from '~app/components/common/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import LinkText from '~app/components/common/LinkText/LinkText';
import NameAndAddress from '~app/components/common/NameAndAddress';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { addNumber, formatNumberToUi, multiplyNumber } from '~lib/utils/numbers';
import ValidatorDropDownMenu from '~app/components/applications/SSV/MyAccount/components/EnableAccount/Components/ValidatorDropDownMenu/ValidatorDropDownMenu';
import { useStyles } from './EnableAccount.styles';
import Decimal from 'decimal.js';

const EnableAccount = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const [validators, setValidators] = useState([]);
    const [ownerAddressCost, setOwnerAddressCost] = useState(0);
    const networkYearlyFees = ssvStore.newGetFeeForYear(ssvStore.networkFee, 11);
    const allOperatorsFee = new Decimal(ssvStore.newGetFeeForYear(ownerAddressCost, 18)).toFixed().toString();
    const liquidationCollateral = multiplyNumber(
        addNumber(ssvStore.networkFee, ownerAddressCost),
        ssvStore.liquidationCollateral,
    );
    const totalFee = addNumber(addNumber(allOperatorsFee, networkYearlyFees), liquidationCollateral);

    const summaryFields = [
        { name: 'Operators yearly fee', value: formatNumberToUi(allOperatorsFee) },
        { name: 'Network yearly fee', value: formatNumberToUi(networkYearlyFees), toolTipText: <>Fees charged for using the network. Fees are determined by the DAO and are used for network growth and expansion. <LinkText text={'Read more on fees'} link={'TODO'} /></> },
        { name: 'Liquidation collateral', value: formatNumberToUi(liquidationCollateral.toString()), toolTipText: <>Collateral in the form of SSV tokens to be paid to liquidators in case of account insolvency. <LinkText text={'Read more on liquidations'} link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'} /></> },
    ];

    useEffect(() => {
        if (!walletStore.accountAddress) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        Validator.getInstance().getValidatorsByOwnerAddress({
            page: 1,
            perPage: 100,
            extendData: false,
            withOperators: true,
            ownerAddress: walletStore.accountAddress,
        }).then(async (res) => {
            const response = await Validator.getInstance().getOwnerAddressCost(walletStore.accountAddress);
            setValidators(res.validators);
            // @ts-ignore
            setOwnerAddressCost(walletStore.fromWei(response.fees.per_block.wei));
        });
    }, []);

    const enableAccount = async (fee: any) => {
       const response = await ssvStore.activateValidator(fee);
       if (response) history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
    };

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
                      Your account has been <LinkText text={'liquidated'} link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'} /> due to insufficient balance
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
                    <Grid item container xs={12} className={classes.ValidatorsDropDownWrapper}>
                      {validators?.map((validator: any, index: number) => {
                            return (
                              <ValidatorDropDownMenu
                                key={index}
                                index={index}
                                validator={validator}
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
                                  <Grid item container xs style={{ gap: 4 }}>
                                    <Grid item>
                                      <Typography className={classes.Text}>{field.name}</Typography>
                                    </Grid>
                                    <Grid item>
                                      {field.toolTipText && <ToolTip text={field.toolTipText} />}
                                    </Grid>
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
                <SsvAndSubTitle bold ssv={formatNumberToUi(totalFee)} />
              </Grid>
              <Grid item xs={12}>
                <Button text={'Enable Account'} disable={validators.length === 0} onClick={() => { enableAccount(totalFee); }} withAllowance />
              </Grid>
            </Grid>
          )}
        />
      </div>
    );
};

export default observer(EnableAccount);