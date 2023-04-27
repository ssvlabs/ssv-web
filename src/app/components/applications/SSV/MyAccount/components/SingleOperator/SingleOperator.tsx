import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import Button from '~app/components/common/Button';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import { Table } from '~app/components/common/Table/Table';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import ProcessStore, { SingleOperator as SingleOperatorProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/SingleOperator/SingleOperator.styles';
import UpdateFeeState from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/UpdateFeeState';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const SingleOperator = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const beaconchaBaseUrl = getBaseBeaconchaUrl();
  // const [operator, setOperator] = useState(null);
  const [operatorsValidators, setOperatorsValidators] = useState([]);
  const [operatorsValidatorsPagination, setOperatorsValidatorsPagination] = useState(null);
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  // const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;
  const process: SingleOperatorProcess = processStore.getProcess;
  const notificationsStore: NotificationsStore = stores.Notifications;
  const operator = process?.item;

  useEffect(() => {
    if (!operator) return navigate(applicationStore.strategyRedirect);
    loadOperatorValidators({ page: 1, perPage: 5 });
  }, []);

  const loadOperatorValidators = async (props: { page: number, perPage: number }) => {
    // eslint-disable-next-line react/prop-types
    const { page, perPage } = props;
    const response = await Operator.getInstance().getOperatorValidators({
      // @ts-ignore
      operatorId: operator.id,
      page,
      perPage,
    });
    setOperatorsValidators(response.validators);
    setOperatorsValidatorsPagination(response.pagination);
  };

  const onChangeRowsPerPage = (type: string, perPage: number) => {
    loadOperatorValidators({ page: 1, perPage });
  };

  const onChangePage = (obj: any) => {
    // @ts-ignore
    loadOperatorValidators({ page: obj.paginationPage, perPage: operatorsValidatorsPagination?.per_page ?? 5 });
  };

  // @ts-ignore
  const { page, pages, per_page, total } = operatorsValidatorsPagination || {};

  // @ts-ignore
  const { logo, validators_count, fee, performance } = operator || {};
  const validator30dPerformance = operator ? performance['30d'] : 0;
  const yearlyFee = formatNumberToUi(ssvStore.getFeeForYear(walletStore.fromWei(fee)));
  const classes = useStyles({ operatorLogo: logo, noValidators: operatorsValidators.length === 0 });

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    notificationsStore.showMessage('Copied to clipboard.', 'success');
  };

  const openExplorer = (key: string, linkType: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: linkType,
    });
    window.open(`${config.links.EXPLORER_URL}/${key}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`, '_blank');
  };

  const moveToUpdateFee = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START);
  };

  const moveToWithdraw = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.WITHDRAW);
  };

  const openBeaconcha = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha',
    });
    window.open(`${beaconchaBaseUrl}/validator/${publicKey}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`, '_blank');
  };

    const sortValidatorsByStatus = () => {
        setOperatorsValidators(prevState => [...prevState.sort((a: any, b: any) => a.status === b.status ? 0 : a.status ? -1 : 1)]);
    };

  const operatorView = React.useMemo(
      () => [
        {
          key: <Typography>Name</Typography>,
          value: <Grid item container className={classes.ItemWrapper} xs={12}>
            <OperatorDetails withCopy operator={operator}/>
          </Grid>,
        },
        {
          key: <Grid container item alignItems={'center'}>
            <Grid item style={{ marginTop: 1, marginRight: 4 }}>
              Status
            </Grid>
            <ToolTip
                text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'}/>
          </Grid>,
          value: <Grid item container className={classes.ItemWrapper} xs={12}>
            <Status item={operator} />
          </Grid>,
        },
        {
          key: <Typography>Validators</Typography>,
          value: <Grid item container className={classes.ItemWrapper} xs={12}>
            <Typography className={classes.TableValueText}>{validators_count}</Typography>
          </Grid>,
        },
        {
          key: <Typography>30D Performance</Typography>,
          value: <Grid item container className={classes.ItemWrapper} xs={12}>
            <Typography className={classes.TableValueText}>{validator30dPerformance === 0 ? '-' : validator30dPerformance}</Typography>
          </Grid>,
        },
      ], [operator, applicationStore.darkMode],
  );

  const data = React.useMemo(
      () => {
        // return validator operators mapped with additional fields fee and performance
        // @ts-ignore
        return operatorsValidators?.map((validator: any) => {
          // eslint-disable-next-line no-param-reassign
          const {
            public_key,
          } = validator;

          return {
            status: <Status item={validator} />,
            public_key: <Grid container style={{ alignItems: 'center', gap: 16 }}>
              <Typography className={classes.TableValueText}>{longStringShorten(public_key, 6, 4)}</Typography>
              <ImageDiv onClick={() => copyToClipboard(validator.public_key)} image={'copy'} width={20} height={20} />
            </Grid>,
            extra_buttons: <Grid item container className={classes.ExtraButtonWrapper}>
              <ImageDiv onClick={() => openExplorer(`validators/${validator.public_key}`, 'validator')}
                        image={'explorer'}
                        width={20} height={20} />
              <ImageDiv onClick={() => openBeaconcha(`0x${validator.public_key}`)} image={'beacon'} width={20}
                        height={20} />
            </Grid>,
          };
        });
      },
      [operatorsValidators, applicationStore.darkMode],
  );

  const columns = React.useMemo(
      () => [
        {
          id: 'col13',
          Header: <Grid item container justifyContent={'space-between'} alignItems={'center'}>
            <Typography>Validators</Typography>
          </Grid>,
          columns: [
            {
              Header: 'Address',
              accessor: 'public_key',
            },
            {
              Header: <Grid container item alignItems={'center'}>
                <Typography onClick={() => sortValidatorsByStatus()} style={{ marginRight: 4, cursor:  'pointer' }}>
                  Status
                </Typography>
                <ToolTip
                    text={'Refers to the validators status in the SSV network (not beacon chain),and reflects whether its operators are consistently performing their duties(according to the last 2 epochs)'}/>
              </Grid>,
              accessor: 'status',
            },
            {
              Header: '',
              accessor: 'extra_buttons',
            },

          ],
        },
      ], [applicationStore.darkMode],
  );

  return (
      <Grid container item style={{ gap: 26 }}>
        <NewWhiteWrapper
            type={1}
            mainFlow
            header={'Operator Details'}
        >
          <Grid item container className={classes.ItemsWrapper}>
            {operatorView.map((item: any, index: number) => (
                <Grid item key={index}>
                  <Grid item xs={12} className={classes.TableKey}>
                    {item.key}
                  </Grid>
                  {item.value}
                </Grid>
            ))}
          </Grid>
        </NewWhiteWrapper>
        <Grid container item className={classes.BoxesWrapper}>
          <Grid container item className={classes.BoxWrapper}>
            <Grid item className={classes.Box}>
              <BorderScreen
                  withoutNavigation
                  header={'Balance'}
                  SideHeader={UpdateFeeState}
                  sectionClass={classes.AnnualSection}
                  body={[
                    <Grid container item>
                      <Grid item xs={12}>
                        <SsvAndSubTitle ssv={formatNumberToUi(operator.balance) || 0} bold leftTextAlign/>
                      </Grid>
                    </Grid>,
                  ]}
                  bottom={[
                    <Grid item xs>
                      <Button disable={false} text={'Withdraw'} onClick={moveToWithdraw}/>
                    </Grid>,
                  ]}
                  bottomWrapper={classes.ButtonSection}
                  wrapperClass={classes.AnnualWrapper}
              />
            </Grid>
            <Grid item className={classes.Box}>
              <BorderScreen
                  marginTop={0}
                  withoutNavigation
                  header={'Annual Fee'}
                  SideHeader={UpdateFeeState}
                  sectionClass={classes.AnnualSection}
                  body={[
                    <Grid container item>
                      <Grid item xs={12}>
                        <SsvAndSubTitle ssv={yearlyFee || 0} bold leftTextAlign/>
                      </Grid>
                    </Grid>,
                  ]}
                  bottom={[
                    <Grid item xs>
                      <SecondaryButton disable={true} text={'Update Fee'} submitFunction={moveToUpdateFee} />
                    </Grid>,
                  ]}
                  bottomWrapper={classes.ButtonSection}
                  wrapperClass={classes.AnnualWrapper}
              />
            </Grid>
          </Grid>
          {validators_count === 0 && <Grid container item className={classes.TableWrapper}>
            <Grid container item className={classes.BigBox}>
              <Grid item className={classes.NoValidatorImage} xs={12}/>
              <Grid item xs={12}>
                <Typography className={classes.NoValidatorText}>No Validators</Typography>
              </Grid>
            </Grid>
          </Grid>}
          {validators_count > 0 && (
              <Grid item className={classes.OperatorsValidatorsTable}>
                <Table
                    data={data}
                    columns={columns}
                    actionProps={{
                      onChangePage,
                      perPage: per_page,
                      type: 'operator',
                      currentPage: page,
                      totalPages: pages,
                      totalAmountOfItems: total,
                      onChangeRowsPerPage,
                    }}
                />
              </Grid>
          )}
        </Grid>
      </Grid>
  );
};

export default observer(SingleOperator);
