import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import Validator from '~lib/api/Validator';
import ApiParams from '~lib/api/ApiParams';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/common/components/Status';
import { longStringShorten } from '~lib/utils/strings';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import ToolTip from '~app/common/components/ToolTip/ToolTip';
import { ReactTable } from '~app/common/components/ReactTable';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/MyAccount/components/DashboardTables/DashboardTables.styles';
import { formatNumberToUi } from '~lib/utils/numbers';

type LoadItemsParams = {
    type: string;
    forcePerPage?: number;
    paginationPage?: number;
};

const DashboardTables = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const defaultOperators: any[] = [];
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const [operators, setOperators] = useState(defaultOperators);
    const [validators, setValidators] = useState(defaultOperators);
    const [loadingOperators, setLoadingOperators] = useState(true);
    const [loadingValidators, setLoadingValidators] = useState(true);
    const [operatorsPagination, setOperatorsPagination] = useState(ApiParams.DEFAULT_PAGINATION);
    const [validatorsPagination, setValidatorsPagination] = useState(ApiParams.DEFAULT_PAGINATION);

    // @ts-ignore
    useEffect(async () => {
        if (walletStore.accountAddress) {
            await loadItems({ type: 'validators' });
            await loadItems({ type: 'operators' });
        }
    }, [walletStore.accountAddress]);

    const getOperatorRevenue = async (operator: any) => {
        const revenue = await operatorStore.getOperatorsRevenue(operator.operator_id);
        // eslint-disable-next-line no-param-reassign
        operator.revenue = revenue;
        return operator;
    };

    const getOperatorsRevenue = async (operatorsList: any) => {
        return Promise.all(operatorsList.map((operator: any) => getOperatorRevenue(operator)));
    };

    /**
     * Loading operators by page
     * @param props: LoadItemsParams
     */
    async function loadItems(props: LoadItemsParams) {
        // eslint-disable-next-line react/prop-types
        const { type, forcePerPage, paginationPage } = props;
        if (paginationPage) {
            ApiParams.saveInStorage(type, 'page', paginationPage);
        }
        const operatorsExist = Operator.getInstance()?.ownerAddressOperators?.length > 0;
        const validatorsExist = Validator.getInstance()?.validators?.length > 0;

        const page: number = ApiParams.getInteger(type, 'page', 1);
        const perPage: number = !validatorsExist || !operatorsExist ? 10 : ApiParams.getInteger(type, 'perPage', ApiParams.PER_PAGE);

        if (type === 'operators') {
            setLoadingOperators(true);
            const result = await Operator.getInstance().getOperatorsByOwnerAddress(page, forcePerPage ?? perPage, walletStore.accountAddress);
            const operatorsList = await getOperatorsRevenue(result.operators);
            setOperators(operatorsList);
            setOperatorsPagination(result.pagination);
            setLoadingOperators(false);
        } else {
            setLoadingValidators(true);
            const result = await Validator.getInstance().getValidatorsByOwnerAddress({ page, perPage: forcePerPage ?? perPage, ownerAddress: walletStore.accountAddress });
            if (result?.validators?.length > 0) ssvStore.userState = 'validator';
            setValidators(result.validators);
            setValidatorsPagination(result.pagination);
            setLoadingValidators(false);
        }
    }

    /**
     * When per page dropdown changed
     * @param type
     * @param perPage
     */
    function onChangeRowsPerPage(type: string, perPage: number) {
        ApiParams.saveInStorage(type, 'perPage', perPage);
        loadItems({ type, paginationPage: 1 });
    }

    const openSingleValidator = (publicKey: string) => {
        history.push(`/dashboard/validator/${publicKey}`);
    };
    const openSingleOperator = (operator_id: string) => {
        history.push(`/dashboard/operator/${operator_id}`);
    };

    const copyToClipboard = (publicKey: string) => {
        navigator.clipboard.writeText(publicKey);
        // notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const validatorsColumns = [
        {
            id: 'col14',
            Header: <Grid container justify={'space-between'} alignItems={'center'}>
              <Typography>Validators</Typography>
            </Grid>,
            columns: [
                {
                    Header: 'Public key',
                    accessor: 'public_key',
                    width: 60,
                },
                {
                    Header: <Grid container item alignItems={'center'}>
                      <Grid item style={{ marginRight: 4 }}>
                        Status
                      </Grid>
                      <ToolTip text={'Refers to the validator’s status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties (according to the last 2 epochs).'} />
                    </Grid>,
                    accessor: 'status',
                },
                {
                    Header: 'Balance',
                    accessor: 'balance',
                },
                {
                    Header: 'Est. APR',
                    accessor: 'apr',
                },
                {
                    Header: '',
                    accessor: 'extra_buttons',
                },
            ],
        },
    ];

    const operatorsColumns = [
        {
            id: 'col13',
            Header: <Grid container justify={'space-between'} alignItems={'center'}>
              <Typography>Operators</Typography>
            </Grid>,
            columns: [
                {
                    Header: 'Public key',
                    accessor: 'public_key',
                    width: 60,
                },
                {
                    Header: <Grid container item alignItems={'center'}>
                      <Grid item style={{ marginRight: 4 }}>
                        Status
                      </Grid>
                      <ToolTip text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'} />
                    </Grid>,
                    accessor: 'status',
                },
                {
                    Header: 'Revenue',
                    accessor: 'revenue',
                },
                {
                    Header: 'Validators',
                    accessor: 'validators_count',
                },
                {
                    Header: '',
                    accessor: 'extra_buttons',
                },
            ],
        },
    ];

    // return validator operators mapped with additional fields fee and performance
    const validatorsData = validators?.map((operator: any) => {
        const { public_key, status, balance, apr } = operator;

        return {
            public_key: <Grid container item>
              <Grid container item className={classes.Name}>
                <Grid>{longStringShorten(public_key, 6, 4)}</Grid>
                <Grid className={classes.copyImage} onClick={() => {
                        copyToClipboard(public_key);
                    }} />
              </Grid>
            </Grid>,
            status: <Status status={status} />,
            balance: <Grid container item>
              <Grid item xs={12} className={classes.Balance}>{balance} ETH</Grid>
              {/* <Grid item xs={12} className={classes.DollarBalance}>~$5.02</Grid> */}
            </Grid>,
            apr: <Grid container item>
              <Grid item xs={12} className={classes.ValidatorApr}>{apr}%</Grid>
            </Grid>,
            extra_buttons: <Grid container item justify={'flex-end'}>
              <Grid className={classes.BeaconImage} onClick={() => {
                    window.open(`${getBaseBeaconchaUrl()}/validator/${public_key}`);
                }} />
              <Grid className={classes.ExplorerImage} onClick={() => {
                    window.open(`${config.links.LINK_EXPLORER}/validators/${public_key.replace('0x', '')}`);
                }} />
              <Grid className={classes.SettingsImage} onClick={() => {
                    openSingleValidator(public_key);
                }} />
            </Grid>,
        };
    });

    // return validator operators mapped with additional fields fee and performance
    const operatorsData = operators?.map((operator: any) => {
        const { public_key, name, address, status, revenue, validators_count } = operator;

        return {
            public_key: <Grid container item>
              <Grid item xs={12} className={classes.Name}>{name}</Grid>
              <Grid container item className={classes.Name}>
                <Grid>{longStringShorten(sha256(public_key), 4, 4)}</Grid>
                <Grid className={classes.copyImage} onClick={() => {
                        copyToClipboard(address);
                    }} />
              </Grid>
            </Grid>,
            status: <Status status={status} />,
            revenue: <Grid container item>
              <Grid item xs={12} className={classes.Balance}>{formatNumberToUi(revenue)} SSV</Grid>
              <Grid item xs={12} className={classes.DollarBalance}>~$5.02</Grid>
            </Grid>,
            validators_count: <Grid item className={classes.ValidatorApr}>{validators_count}</Grid>,
            fee: <Grid item container justify={'space-between'}>
              <Grid item container xs>
                <Grid item xs={12}>
                  <Typography>{operatorStore.getFeePerYear(walletStore.fromWei(operator.fee))} SSV</Typography>
                </Grid>
                <Grid item>~$757.5</Grid>
              </Grid>
              <Grid className={classes.ExplorerImage} onClick={() => {
                    window.open(`${config.links.LINK_EXPLORER}/operators/${public_key}`);
                }} />
            </Grid>,
            extra_buttons: <Grid container item justify={'flex-end'}>
              <Grid className={classes.ExplorerImage} onClick={() => {
                    window.open(`${config.links.LINK_EXPLORER}/operators/${address}`);
                }} />
              <Grid className={classes.SettingsImage} onClick={() => {
                    openSingleOperator(operator.operator_id);
                }} />
            </Grid>,
        };
    });

    return (
      <Grid container item className={classes.Table}>
        {validators.length > 0 && (
        <Grid item xs={12} style={{ marginBottom: 20 }}>
          <ReactTable
            data={validatorsData}
            cols={validatorsColumns}
            loading={loadingValidators}
            actionProps={{
                            type: 'validators',
                            onChangeRowsPerPage,
                            onChangePage: loadItems,
                            totalPages: validatorsPagination.pages,
                            currentPage: validatorsPagination.page,
                            totalAmountOfItems: validatorsPagination.total,
                            perPage: ApiParams.getInteger('validators', 'perPage', ApiParams.PER_PAGE),
                        }}
          />
        </Grid>
        )}

        {operators.length > 0 && (
        <Grid item xs style={{ marginBottom: 20 }}>
          <ReactTable
            data={operatorsData}
            cols={operatorsColumns}
            loading={loadingOperators}
            actionProps={{
                            type: 'operators',
                            onChangeRowsPerPage,
                            onChangePage: loadItems,
                            totalPages: operatorsPagination.pages,
                            currentPage: operatorsPagination.page,
                            totalAmountOfItems: operatorsPagination.total,
                            perPage: ApiParams.getInteger('operators', 'perPage', ApiParams.PER_PAGE),
                        }}
          />
        </Grid>
        )}
      </Grid>
    );
};

export default React.memo(observer(DashboardTables));
