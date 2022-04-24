import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton/PrimaryButton';
import OperatorDetails from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import { useStyles } from './SecondSquare.styles';

const SecondSquare = ({ editPage }: { editPage: boolean }) => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    // @ts-ignore
    const { public_key } = useParams();
    const operatorStore: OperatorStore = stores.Operator;
    const [allSelectedOperatorsVerified, setAllSelectedOperatorsVerified] = useState(true);
    const boxes = [1, 2, 3, 4];

    const removeOperator = (index: number) => {
        operatorStore.unselectOperator(index);
    };

    const onSelectOperatorsClick = async () => {
        if (process.env.REACT_APP_NEW_STAGE) {
            if (editPage) {
                history.push(`/dashboard/validator/${public_key}/upload_key_store`);
            } else {
                history.push(config.routes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE);
            }
        } else {
            history.push(config.routes.VALIDATOR.SLASHING_WARNING);
        }
    };

    const linkToNotVerified = () => {
        window.open('https://snapshot.org/#/mainnet.ssvnetwork.eth/proposal/QmbuDdbbm7Ygan8Qi8PWoGzN3NJCVmBJQsv2roUTZVg6CH');
    };

    useEffect(() => {
        const notVerifiedOperators = Object.values(operatorStore.selectedOperators).filter(operator => operator.type !== 'verified_operator' && operator.type !== 'dappnode');
        setAllSelectedOperatorsVerified(notVerifiedOperators.length === 0);
    }, [JSON.stringify(operatorStore.selectedOperators)]);

    return (
      <BorderScreen
        withoutNavigation={editPage}
        wrapperClass={classes.ScreenWrapper}
        body={[
          <Grid container>
            <HeaderSubHeader title={'Selected Operators'} />
            <Grid container item>
              {boxes.map((index: number) => {
                      if (operatorStore.selectedOperators[index]) {
                          const operator = operatorStore.selectedOperators[index];
                          return (
                            <Grid key={index} container className={classes.SelectedOperatorBox}>
                              <Grid className={classes.DeleteOperator} onClick={() => { removeOperator(index); }}><Grid className={classes.whiteLine} /></Grid>
                              <OperatorDetails operator={operator} />
                            </Grid>
                          );
                      }
                      return (
                        <Grid key={index} item className={classes.BoxPlaceHolder}>Select Operator
                          0{index}</Grid>
                      );
                  })}
            </Grid>
            {!allSelectedOperatorsVerified && (
              <Grid container item xs={12} className={classes.WarningMessage}>
                <Grid item xs={12} className={classes.WarningHeader}>
                  You have selected one or more operators that are <Grid className={classes.NotVerifiedText} onClick={linkToNotVerified}>not verified.</Grid>
                </Grid>
                <Grid item xs={12}>
                  Unverified operators that were not reviewed and their identity is not confirmed, may pose a threat to your validators’ performance.
                </Grid>
                <Grid item xs={12}>
                  Please proceed only if you know and trust these operators.
                </Grid>
              </Grid>
              )}
            {process.env.REACT_APP_NEW_STAGE && (
              <Grid container item xs={12} className={classes.TotalFeesWrapper} justify={'space-between'}>
                <Grid item className={classes.TotalFeesHeader}>
                  Total Operators Yearly Fee
                </Grid>
                <Grid item>
                  <SsvAndSubTitle bold ssv={operatorStore.getSelectedOperatorsFee}
                    subText={'~$757.5'} subTextCenter={false} />
                </Grid>
              </Grid>
              )}
            <PrimaryButton dataTestId={'operators-selected-button'} disable={!operatorStore.selectedEnoughOperators} text={'Next'} submitFunction={onSelectOperatorsClick} />
          </Grid>,
        ]}
      />
    );
};

export default observer(SecondSquare);
