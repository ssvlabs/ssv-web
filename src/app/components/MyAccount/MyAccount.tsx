import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import ApiRequest from '~lib/utils/ApiRequest';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import DataTable from '~app/common/components/DataTable';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import OperatorStore, { IOperator } from '~app/common/stores/Operator.store';
import Rows from '~app/components/MyAccount/common/componenets/Rows';
import MyBalance from '~app/components/MyAccount/components/MyBalance';
import { formatDaysToUi, formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';
import { useStyles } from './MyAccount.styles';

const validatorHeaderInit = ['PUBLIC KEY', 'STATUS', 'BALANCE', 'EST. APR', ''];
const operatorHeaderInit = ['PUBLIC KEY', 'STATUS', 'REVENUE', 'VALIDATORS', ''];

const MyAccount = () => {
    const classes = useStyles();
    const stores = useStores();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const operatorStore: OperatorStore = stores.Operator;
    const [operators, setOperators] = useState([]);
    const [validators, setValidators] = useState([]);
    const [width, setWidth] = React.useState(window.innerWidth);
    const [displayStatus, setDisplayStatus] = useState(true);
    const [displayValidators, setDisplayValidators] = useState(true);
    const [operatorsPage, setOperatorsPage] = useState(0);
    const [validatorsPage, setValidatorsPage] = useState(0);
    const breakPoints = [
        {
            width: 768,
            operatorHeader: ['PUBLIC KEY', 'REVENUE', 'VALIDATORS', ''],
            validatorHeaders: ['PUBLIC KEY', 'BALANCE', 'EST. APR', ''],
            callBack: setDisplayStatus,
        },
        {
            width: 499,
            operatorHeader: ['PUBLIC KEY', 'REVENUE'],
            validatorHeaders: ['PUBLIC KEY', 'BALANCE'],
            callBack: setDisplayValidators,
        },
    ];
    const [validatorsHeader, setValidatorHeader] = useState(validatorHeaderInit);
    const [operatorsHeader, setOperatorHeader] = useState(operatorHeaderInit);
    const [dropDownMenu, displayDropDownMenu] = useState(false);
    const remainingDays = formatDaysToUi(ssvStore.getRemainingDays);
    const liquidated = remainingDays <= 0;

    // Add event listener on screen size change
    useEffect(() => {
        window.addEventListener('resize', () => setWidth(window.innerWidth));
    }, [ssvStore]);

    // Handle resize of the website
    useEffect(() => {
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

    useEffect(() => {
        if (validators.length === 0) {
                const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${ssvStore.userValidators.join(',')}`;
                new ApiRequest({ url, method: 'GET' }).sendRequest().then(async (response: any) => {
                    const beaconchaData = response.data;
                    const validatorsData: any[] = [];
                    if (Array.isArray(beaconchaData)) {
                        // eslint-disable-next-line no-restricted-syntax
                        for (const data of response.data) {
                            // eslint-disable-next-line no-await-in-loop
                            const payload = await buildValidatorStructure(data);
                            validatorsData.push(payload);
                        }
                    } else {
                        const payload = await buildValidatorStructure(beaconchaData);
                        validatorsData.push(payload);
                    }
                    // @ts-ignore
                    setValidators(validatorsData);
                });
        }
    }, [ssvStore.userValidators]);

    useEffect(() => {
        if (operators.length === 0) {
            const operatorsData: any[] = [];
            operatorStore.loadOperators().then((loadedOperators: IOperator[]) => {
                loadedOperators.forEach(async (operator: IOperator) => {
                    if (ssvStore.userOperators.indexOf(operator.pubkey) > -1) {
                        const revenue = await ssvStore.getOperatorRevenue();
                        operatorsData.push({
                            publicKey: operator.pubkey,
                            name: operator.name,
                            status: 'active',
                            revenue: formatNumberToUi(revenue),
                            validators: 0,
                        });
                    }
                });

                // @ts-ignore
                setOperators(operatorsData);
            });
        }
    }, [ssvStore.userOperators]);

    const buildValidatorStructure = async (data: any) => {
        const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${data.pubkey}/performance`;
        const performance: any = await new ApiRequest({ url, method: 'GET' }).sendRequest();
        const balance = formatNumberFromBeaconcha(data.balance);
        const performance7days = formatNumberFromBeaconcha(performance.data.performance7d);
        // @ts-ignore
        const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
        const status = data.status === 'active_online' ? 'active' : 'inactive';
        const publicKey = data.pubkey;
        return { publicKey, status, balance, apr };
    };

    const validatorsRows = Rows({ items: validators, shouldDisplayStatus: displayStatus, shouldDisplayValidators: displayValidators });
    const operatorsRows = Rows({ items: operators, shouldDisplayStatus: displayStatus, shouldDisplayValidators: displayValidators });

    return (
      <Grid container className={classes.Wrapper}>
        <Grid container item xs={12} className={classes.Header} justify={'space-between'}>
          <Grid item container xs>
            <Grid item>
              <span className={classes.HeaderText}>
                My Account
              </span>
            </Grid>
            {liquidated && (
              <Grid item className={classes.Liquidated}>
                Liquidated
              </Grid>
              )}
          </Grid>
          <Grid item xs={6}>
            <Grid className={classes.AddButton} onClick={() => {
                        displayDropDownMenu(!dropDownMenu);
                    }}>
              <Typography className={classes.AddButtonText}>+ Add</Typography>
              {dropDownMenu && (
                <Grid container className={classes.AddButtonDropDown}>
                  <Grid item xs={12} className={classes.AddButtonDropDownItem} onClick={() => {
                                    history.push(config.routes.VALIDATOR.HOME);
                                }}>Run Validator</Grid>
                  <Grid item xs={12} className={classes.AddButtonDropDownItem} onClick={() => {
                                    history.push(config.routes.OPERATOR.HOME);
                                }}>Register Operator</Grid>
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
            {ssvStore.userOperators.length > 0 && (
              <Grid item className={classes.Table}>
                <DataTable
                  title={'Operators'}
                  headers={operatorsHeader}
                  headersPositions={['left', 'left', 'left', 'left']}
                  data={operatorsRows}
                  totalCount={operators.length}
                  page={operatorsPage}
                  onChangePage={setOperatorsPage}
                  isLoading={operators.length === 0}
                />
              </Grid>
              )}
            {ssvStore.userValidators.length > 0 && (
              <Grid className={classes.Table}>
                <DataTable
                  title={'Validators'}
                  headers={validatorsHeader}
                  headersPositions={['left', 'left', 'left', 'left']}
                  data={validatorsRows}
                  totalCount={validators.length}
                  page={validatorsPage}
                  onChangePage={setValidatorsPage}
                  isLoading={validators.length === 0}
                />
              </Grid>
              )}
          </Grid>
        </Grid>
      </Grid>
    );
};

export default observer(MyAccount);
