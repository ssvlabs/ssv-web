import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ContractSsvStore from '~app/common/stores/contract/ContractSsv.store';
import DataTable from '~app/common/components/DataTable';
import Rows from '~app/components/MyAccount/common/componenets/Rows';
import MyBalance from '~app/components/MyAccount/components/MyBalance';
import { useStyles } from './MyAccount.styles';
import { operators, validators } from './template';

const validatorHeaderInit = ['PUBLIC KEY', 'STATUS', 'BALANCE', 'EST. APR', ''];
const operatorHeaderInit = ['PUBLIC KEY', 'STATUS', 'REVENUE', 'VALIDATORS', ''];

const MyAccount = () => {
    const classes = useStyles();
    const stores = useStores();
    const history = useHistory();
    const allowanceStore: ContractSsvStore = stores.Allowance;
    const [width, setWidth] = React.useState(window.innerWidth);
    const [displayStatus, setDisplayStatus] = useState(true);
    const [displayValidators, setDisplayValidators] = useState(true);
    const [operatorsPage, setOperatorsPage] = useState(0);
    const [validatorsPage, setValidatorsPage] = useState(0);
    const breakPoints = [
        { width: 768, operatorHeader: ['PUBLIC KEY', 'REVENUE', 'VALIDATORS', ''], validatorHeaders: ['PUBLIC KEY', 'BALANCE', 'EST. APR', ''], callBack: setDisplayStatus },
        { width: 499, operatorHeader: ['PUBLIC KEY', 'REVENUE'], validatorHeaders: ['PUBLIC KEY', 'BALANCE'], callBack: setDisplayValidators },
    ];
    const [validatorsHeader, setValidatorHeader] = useState(validatorHeaderInit);
    const [operatorsHeader, setOperatorHeader] = useState(operatorHeaderInit);
    const [dropDownMenu, displayDropDownMenu] = useState(false);

    React.useEffect(() => {
        /* Inside of a "useEffect" hook add an event listener that updates
           the "width" state variable when the window size changes */
        window.addEventListener('resize', () => setWidth(window.innerWidth));

        /* passing an empty array as the dependencies of the effect will cause this
           effect to only run when the component mounts, and not each time it updates.
           We only want the listener to be added once */
    }, [allowanceStore]);

    React.useEffect(() => {
        let isBigScreen = true;
        breakPoints.forEach((breakPoint) => {
            if (breakPoint.width > width) {
                isBigScreen = false;
                setOperatorHeader(breakPoint.operatorHeader);
                setValidatorHeader(breakPoint.validatorHeaders);
                breakPoint.callBack(false);
            } else if (!displayValidators || !displayStatus) {
                breakPoint.callBack(true);
            }
        });
        if (isBigScreen && validatorsHeader.length < 5 && operatorsHeader.length < 5) {
            setValidatorHeader(validatorHeaderInit);
            setOperatorHeader(operatorHeaderInit);
        }
    }, [width]);

    return (
      <Grid container className={classes.Wrapper}>
        {/* <Grid onClick={() => { allowanceStore.checkAllowance(); }}>asdlkasndajndjkasdnjaksnd</Grid> */}
        <Grid container item xs={12} className={classes.Header}>
          <Grid item xs={6}>
            <span className={classes.HeaderText}>
              My Account
            </span>
          </Grid>
          <Grid item xs={6}>
            <Grid className={classes.AddButton} onClick={() => { displayDropDownMenu(!dropDownMenu); }}>
              <Typography className={classes.AddButtonText}>+ Add</Typography>
              {dropDownMenu && (
                <Grid container className={classes.AddButtonDropDown}>
                  <Grid item xs={12} className={classes.AddButtonDropDownItem} onClick={() => { history.push(config.routes.VALIDATOR.HOME); }}>Run Validator</Grid>
                  <Grid item xs={12} className={classes.AddButtonDropDownItem} onClick={() => { history.push(config.routes.OPERATOR.HOME); }}>Register Operator</Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item className={classes.MyBalanceWrapper}>
            <MyBalance />
          </Grid>
          <Grid container item direction={'column'} className={classes.TablesWrapper}>
            <Grid item className={classes.Table}>
              <DataTable
                title={'Operators'}
                headers={operatorsHeader}
                headersPositions={['left', 'left', 'left', 'left']}
                data={Rows({ items: operators, shouldDisplayStatus: displayStatus, shouldDisplayValidators: displayValidators })}
                totalCount={operators.length}
                page={operatorsPage}
                onChangePage={setOperatorsPage}
                isLoading={false}
              />
            </Grid>
            <Grid className={classes.Table}>
              <DataTable
                title={'Validators'}
                headers={validatorsHeader}
                headersPositions={['left', 'left', 'left', 'left']}
                data={Rows({ items: validators, shouldDisplayStatus: displayStatus, shouldDisplayValidators: displayValidators })}
                totalCount={0}
                page={validatorsPage}
                onChangePage={setValidatorsPage}
                // isLoading
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
};

export default observer(MyAccount);
