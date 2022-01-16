import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import config from '~app/common/config';
import ApiRequest from '~lib/utils/ApiRequest';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import DataTable from '~app/common/components/DataTable';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import Rows from '~app/components/MyAccount/common/componenets/Rows';
import MyBalance from '~app/components/MyAccount/components/MyBalance';
import OperatorStore, { IOperator } from '~app/common/stores/Operator.store';
import { formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';
import { useStyles } from './MyAccount.styles';

const validatorHeaderInit = ['PUBLIC KEY', 'STATUS', 'BALANCE', 'EST. APR', ''];
const operatorHeaderInit = ['PUBLIC KEY', 'STATUS', 'REVENUE', 'VALIDATORS', ''];

const MyAccount = () => {
    const classes = useStyles();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const wrapperRef = useRef(null);
    const walletStore: WalletStore = stores.Wallet;
    const { redirectUrl, history } = useUserFlow();
    const operatorStore: OperatorStore = stores.Operator;
    const [operators, setOperators] = useState([]);
    const [validators, setValidators] = useState([]);
    const [operatorsPage, setOperatorsPage] = useState(0);
    const [validatorsPage, setValidatorsPage] = useState(0);
    const [displayStatus, setDisplayStatus] = useState(true);
    const [dropDownMenu, displayDropDownMenu] = useState(false);
    const [operatorsHeader, setOperatorHeader] = useState(operatorHeaderInit);
    const [loadingOperators, setLoadingOperators] = useState(false);
    const [displayValidators, setDisplayValidators] = useState(true);
    const [loadingValidators, setLoadingValidators] = useState(false);
    const [validatorsHeader, setValidatorHeader] = useState(validatorHeaderInit);
    const [perPage, setPerPage] = useState(ssvStore.userValidators && ssvStore.userOperators ? 5 : 10);

    const breakPoints = [
        {
            minWidth: 499,
            maxWidth: 768,
            operatorHeader: ['PUBLIC KEY', 'REVENUE', 'VALIDATORS', ''],
            validatorHeaders: ['PUBLIC KEY', 'BALANCE', 'EST. APR', ''],
            callBack: () => {
                setDisplayStatus(false);
                setDisplayValidators(true);
            },
        },
        {
            minWidth: 0,
            maxWidth: 499,
            operatorHeader: ['PUBLIC KEY', 'REVENUE'],
            validatorHeaders: ['PUBLIC KEY', 'BALANCE'],
            callBack: () => {
                setDisplayValidators(false);
            },
        },
    ];

    const liquidated = ssvStore.userLiquidated && ssvStore.isValidatorState;

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    useEffect(() => {
        loadOperators();
    }, [operatorsPage]);

    useEffect(() => {
        loadValidators();
    }, [validatorsPage]);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            // @ts-ignore
            if (dropDownMenu && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                displayDropDownMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef, dropDownMenu]);

    // Handle resize of the website
    useEffect(() => {
        const width = window.innerWidth;
        breakPoints.forEach((breakPoint) => {
            // @ts-ignore
            if (breakPoint.maxWidth >= width && width >= breakPoint.minWidth) {
                // eslint-disable-next-line no-param-reassign
                setOperatorHeader(breakPoint.operatorHeader);
                setValidatorHeader(breakPoint.validatorHeaders);
                breakPoint.callBack();
            }
        });
    }, []);

    const loadOperators = async () => {
        if (ssvStore.userOperators.length) {
            if (!operators.length) setLoadingOperators(true);
            const operatorsData: any[] = [];
            const operatorsIndexLow = operatorsPage * perPage;
            const operatorsIndexHigh = operatorsIndexLow + perPage;
            const userOperators = ssvStore.userOperators.slice(operatorsIndexLow, operatorsIndexHigh);
            await operatorStore.loadOperators().then(() => {
                userOperators.forEach(async (publicKey: string, index: number) => {
                    const operator: IOperator = operatorStore.hashedOperators[walletStore.decodeKey(publicKey)];
                    const revenue = await ssvStore.getOperatorRevenue();
                    operatorsData.push({
                        validators: 0,
                        status: 'active',
                        name: operator.name,
                        publicKey: operator.pubkey,
                        revenue: formatNumberToUi(revenue),
                    });
                    if (index === userOperators.length - 1) {
                        // @ts-ignore
                        setOperators(operatorsData);
                        setLoadingOperators(false);
                    }
                });
            });
        }
    };

    const loadValidators = async () => {
        if (ssvStore.userValidators.length) {
            const validatorsData: any[] = [];
            setLoadingValidators(true);
            const validatorsIndexLow = perPage * validatorsPage;
            const validatorsIndexHigh = validatorsIndexLow + perPage;
            const pageValidators = ssvStore.userValidators.slice(validatorsIndexLow, validatorsIndexHigh);
            const balanceUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${pageValidators.join(',')}`;
            await new ApiRequest({ url: balanceUrl, method: 'GET' }).sendRequest().then(async (beaconchaResponse: any) => {
                const response = beaconchaResponse;
                if (!Array.isArray(response.data)) {
                    response.data = [response.data];
                }

                // eslint-disable-next-line no-restricted-syntax
                for (const validator of pageValidators) {
                    const index: number = pageValidators.indexOf(validator);
                    const validatorBalance: any = response.data.filter((balance: any) => balance.pubkey === validator);
                    // eslint-disable-next-line no-await-in-loop
                    const payload: any = await buildValidatorStructure(validator, validatorBalance[0]);
                    console.log(payload);
                    validatorsData.push(payload);
                    if (index === pageValidators.length - 1) {
                        console.log('now');
                        // @ts-ignore
                        setValidators(validatorsData);
                        setLoadingValidators(false);
                    }
                }
            });
        }
    };

    const buildValidatorStructure = async (validator: string, data: any) => {
        if (!data) return { publicKey: validator, status: 'inactive', balance: '0', apr: '0' };
        const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${data.pubkey}/performance`;
        return new ApiRequest({ url, method: 'GET' }).sendRequest().then((performance: any) => {
            const balance = formatNumberFromBeaconcha(data.balance);
            const performance7days = performance.data ? formatNumberFromBeaconcha(performance.data.performance7d) : 0;
            // @ts-ignore
            const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
            const status = data.status === 'active_online' ? 'active' : 'inactive';
            const publicKey = data.pubkey;
            return { publicKey, status, balance, apr };
        });
    };

    const validatorsRows = Rows({
        items: validators,
        shouldDisplayStatus: displayStatus,
        shouldDisplayValidators: displayValidators,
    });
    const operatorsRows = Rows({
        items: operators,
        shouldDisplayStatus: displayStatus,
        shouldDisplayValidators: displayValidators,
    });

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
            <Grid ref={wrapperRef} className={classes.AddButton} onClick={() => { displayDropDownMenu(!dropDownMenu); }}>
              <Grid className={classes.AddButtonText}>+ Add</Grid>
              {dropDownMenu && (
                <Grid container className={classes.AddButtonDropDown}>
                  <Grid item xs={12}
                    className={`${classes.AddButtonDropDownItem} ${liquidated ? classes.Disable : ''}`}
                    onClick={() => { !liquidated && history.push(config.routes.VALIDATOR.HOME); }}>Run Validator</Grid>
                  <Grid item xs={12}
                    className={classes.AddButtonDropDownItem}
                    onClick={() => { history.push(config.routes.OPERATOR.HOME); }}
                  >
                    Register Operator
                  </Grid>
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
                perPage={perPage}
                title={'Operators'}
                data={operatorsRows}
                page={operatorsPage}
                headers={operatorsHeader}
                isLoading={loadingOperators}
                onChangePage={setOperatorsPage}
                onChangeRowsPerPage={setPerPage}
                totalCount={ssvStore.userOperators.length}
                headersPositions={['left', 'left', 'left', 'left']}
              />
            </Grid>
            )}
            {ssvStore.userValidators.length > 0 && (
            <Grid className={classes.Table}>
              <DataTable
                perPage={perPage}
                title={'Validators'}
                data={validatorsRows}
                page={validatorsPage}
                headers={validatorsHeader}
                isLoading={loadingValidators}
                onChangePage={setValidatorsPage}
                onChangeRowsPerPage={setPerPage}
                totalCount={ssvStore.userValidators.length}
                headersPositions={['left', 'left', 'left', 'left']}
              />
            </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
};

export default observer(MyAccount);
