import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import { Table } from '~app/components/common/Table/Table';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import WhiteWrapper from '~app/components/common/WhiteWrapper/WhiteWrapper';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/SingleValidator/SingleValidator.styles';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const SingleValidator = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const validatorStore: ValidatorStore = stores.Validator;
    const [validator, setValidator] = useState(null);
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;
    // @ts-ignore
    const validatorPublicKey = validator?.public_key;

    useEffect(() => {
        if (!validatorStore.processValidatorPublicKey) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        applicationStore.setIsLoading(true);
        Validator.getInstance().getValidator(validatorStore.processValidatorPublicKey).then((response: any) => {
            if (response) {
                response.total_operators_fee = ssvStore.newGetFeeForYear(response.operators.reduce(
                    (previousValue: number, currentValue: IOperator) => previousValue + walletStore.fromWei(currentValue.fee),
                    0,
                ));
                setValidator(response);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    const fields = [
        { key: 'status', value: 'Status' },
        { key: 'balance', value: 'Balance' },
        { key: 'apr', value: 'Est. APR' },
        { key: 'total_operators_fee', value: 'Total Operators Fee' },
    ];

    const openBeaconcha = () => {
        window.open(`${getBaseBeaconchaUrl()}/validator/${validatorPublicKey}`, '_blank');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(validatorPublicKey);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const openExplorer = () => {
        window.open(`${config.links.LINK_EXPLORER}/validators/${validatorPublicKey.replace('0x', '')}`, '_blank');
    };

    const data = React.useMemo(
        () => {
            // return validator operators mapped with additional fields fee and performance
            // @ts-ignore
            return validator?.operators?.map((operator: any) => {
                // eslint-disable-next-line no-param-reassign
                operator.performance = (operator.performance['30d'] && Number(operator.performance['30d']).toFixed(2)) || 0;

                const {
                    status,
                    address,
                    performance,
                } = operator;

                return {
                    public_key: <OperatorDetails operator={operator} />,
                    status: <Status status={status} />,
                    performance: <Typography className={classes.PerformanceHeader}>{performance}%</Typography>,
                    fee: <Grid item container justify={'space-between'}>
                      <Grid item>
                        <SsvAndSubTitle leftTextAlign ssv={formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))} />
                      </Grid>

                      {/* <Grid item container xs> */}
                      {/*  <Grid item xs={12}> */}
                      {/*    <Typography>{operatorStore.getFeePerYear(walletStore.fromWei(operator.fee))} SSV</Typography> */}
                      {/*  </Grid> */}
                      {/*  <Grid item>~$757.5</Grid> */}
                      {/* </Grid> */}
                      <Grid item className={classes.ExplorerImage} onClick={() => { window.open(`${config.links.LINK_EXPLORER}/operators/${address}`); }} />
                    </Grid>,
                };
            });
        },
        [validator, applicationStore.darkMode],
    );

    const editValidator = () => {
        history.push(config.routes.SSV.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.CHOOSE_OPERATORS);
    };
    
    const columns = React.useMemo(
        () => [
            {
                id: 'col13',
                Header: <Grid container justify={'space-between'} alignItems={'center'}>
                  <Typography>My Operators</Typography>
                  <SecondaryButton disable={ssvStore.userLiquidated} className={classes.Edit} submitFunction={editValidator} text={'Edit'} />
                </Grid>,
                columns: [
                    {
                        Header: 'Public key',
                        accessor: 'public_key',
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
                        Header: '30D Performance',
                        accessor: 'performance',
                    },
                    {
                        Header: 'Yearly Fee',
                        accessor: 'fee',
                    },
                ],
            },
        ], [applicationStore.darkMode],
    );

    if (!validator) return null;

    return (
      <Grid container className={classes.SingleValidatorWrapper}>
        <WhiteWrapper
          backButtonRedirect={config.routes.SSV.MY_ACCOUNT.DASHBOARD}
          withSettings={{
                  text: 'Remove Validator',
                  onClick: () => {
                      history.push(config.routes.SSV.MY_ACCOUNT.VALIDATOR.VALIDATOR_REMOVE.ROOT);
                  },
              }}
          header={'Validator Details'}
          >
          <Grid item container className={classes.FieldsWrapper}>
            <Grid item>
              <Grid className={classes.DetailsHeader}>
                Address
              </Grid>
              <Grid item container className={classes.SubHeaderWrapper}>
                <Typography>{longStringShorten(validatorPublicKey, 6, 4)}</Typography>
                <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
                <ImageDiv onClick={openExplorer} image={'explorer'} width={24} height={24} />
                <ImageDiv onClick={openBeaconcha} image={'beacon'} width={24} height={24} />
              </Grid>
            </Grid>
            {fields.map((field: { key: string, value: string }, index: number) => {
                      // @ts-ignore
                      const fieldKey = validator[field.key];
                      return (
                        <Grid key={index} item>
                          <Grid className={classes.DetailsHeader}>
                            {field.value}
                            {field.key === 'status' && <ToolTip text={'Refers to the validator’s status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties (according to the last 2 epochs).'} />}
                          </Grid>
                          <Grid className={classes.DetailsBody}>
                            {field.key === 'status' ? <Status status={fieldKey} /> : fieldKey}
                          </Grid>
                        </Grid>
                      );
                  })}
          </Grid>
        </WhiteWrapper>
        <Grid item container className={classes.SecondSectionWrapper}>
          <Grid item className={classes.OperatorsWrapper}>
            <Table columns={columns} data={data} hideActions />
          </Grid>
        </Grid>
      </Grid>
    );
};

export default observer(SingleValidator);