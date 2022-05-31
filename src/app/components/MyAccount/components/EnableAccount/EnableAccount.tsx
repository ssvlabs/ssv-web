import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/common/components/Button';
import LinkText from '~app/common/components/LinkText/LinkText';
import NameAndAddress from '~app/common/components/NameAndAddress';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { addNumber, formatNumberToUi, multiplyNumber } from '~lib/utils/numbers';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ValidatorDropDownMenu from '~app/components/MyAccount/components/EnableAccount/Components/ValidatorDropDownMenu/ValidatorDropDownMenu';
import { useStyles } from './EnableAccount.styles';

const EnableAccount = () => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const [validators, setValidators] = useState([]);
    const networkYearlyFees = ssvStore.newGetFeeForYear(ssvStore.networkFee);
    const [ownerAddressCost, setOwnerAddressCost] = useState(0);
    const allOperatorsFee = ssvStore.newGetFeeForYear(ownerAddressCost);
    const liquidationCollateral = multiplyNumber(
        addNumber(ssvStore.networkFee, ownerAddressCost),
        ssvStore.liquidationCollateral,
    );
    const totalFee = addNumber(addNumber(allOperatorsFee, networkYearlyFees), liquidationCollateral);
    const summaryFields = [
        { name: 'Operators yearly fee', value: allOperatorsFee },
        { name: 'Network yearly fee', value: formatNumberToUi(networkYearlyFees) },
        { name: 'Liquidation collateral', value: formatNumberToUi(liquidationCollateral.toString()) },
    ];

    useEffect(() => {
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

    const unableAccount = (fee: any) => {
        ssvStore.activateValidator(fee);
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
                      Your account has been <LinkText text={'liquidated'} link={'www.google.com'} /> due to insufficient balance
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
                <SsvAndSubTitle bold ssv={formatNumberToUi(totalFee)} />
              </Grid>
              <Grid item xs={12}>
                <Button text={'Enable Account'} disable={false} onClick={() => { unableAccount(totalFee); }} withAllowance />
              </Grid>
            </Grid>
          )}
        />
      </div>
    );
};

export default observer(EnableAccount);