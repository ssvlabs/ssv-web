import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import UpdateFeeState from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/UpdateFeeState';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/SingleOperator/SingleOperator.styles';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import BorderScreen from '~app/components/common/BorderScreen';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import LinkText from '~app/components/common/LinkText/LinkText';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import Status from '~app/components/common/Status';
import { Table } from '~app/components/common/Table/Table';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import { ButtonSize } from '~app/enums/Button.enum';
import { useOperatorBalance } from '~app/hooks/operator/useOperatorBalance';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice.ts';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { getStrategyRedirect } from '~app/redux/navigation.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { fetchAndSetOperatorFeeInfo } from '~app/redux/operator.slice.ts';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import { getBeaconChainLink } from '~root/providers/networkInfo.provider';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { getOperatorValidators } from '~root/services/operator.service';

const SingleOperator = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [operatorsValidators, setOperatorsValidators] = useState([]);
  const [operatorsValidatorsPagination, setOperatorsValidatorsPagination] = useState<{ per_page: number } | null>(null);
  const operator = useAppSelector(getSelectedOperator)!;
  const { data: balance } = useOperatorBalance();
  const isDarkMode = useAppSelector(getIsDarkMode);
  const strategyRedirect = useAppSelector(getStrategyRedirect);

  useEffect(() => {
    if (!operator) return navigate(strategyRedirect);
    loadOperatorValidators({ page: 1, perPage: 5 });
    dispatch(fetchAndSetOperatorFeeInfo(operator.id));
  }, []);

  const loadOperatorValidators = async (props: { page: number; perPage: number }) => {
    const { page, perPage } = props;
    const response = await getOperatorValidators({
      operatorId: operator.id,
      page,
      perPage
    });
    setOperatorsValidators(response.validators);
    setOperatorsValidatorsPagination(response.pagination);
  };

  const onChangeRowsPerPage = (perPage: number) => {
    loadOperatorValidators({ page: 1, perPage });
  };

  const onChangePage = (obj: { paginationPage: number }) => {
    loadOperatorValidators({
      page: obj.paginationPage,
      perPage: operatorsValidatorsPagination?.per_page ?? 5
    });
  };

  // @ts-ignore
  const { page, pages, per_page, total } = operatorsValidatorsPagination || {};

  // @ts-ignore
  const { logo, validators_count, fee, performance } = operator || {};
  const validator30dPerformance = operator ? performance['30d'] : 0; // TODO Why if in useEffect in line 50 operator is null checked?
  const yearlyFee = formatNumberToUi(getFeeForYear(fromWei(fee)));
  const classes = useStyles({
    operatorLogo: logo,
    noValidators: operatorsValidators.length === 0
  });

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    dispatch(
      setMessageAndSeverity({
        message: 'Copied to clipboard.',
        severity: 'success'
      })
    );
  };

  const openExplorer = (key: string, linkType: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: linkType
    });
    window.open(`${config.links.EXPLORER_URL}/${key}`, '_blank');
  };

  const moveToUpdateFee = async () => {
    await dispatch(fetchAndSetOperatorFeeInfo(operator.id));
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.UPDATE_FEE.ROOT);
  };

  const moveToWithdraw = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.WITHDRAW);
  };

  const openBeaconcha = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha'
    });
    window.open(`${getBeaconChainLink()}/validator/${publicKey}`);
  };

  const sortValidatorsByStatus = () => {
    setOperatorsValidators((prevState) => [...prevState.sort((a: any, b: any) => (a.status === b.status ? 0 : a.status ? -1 : 1))]);
  };

  const operatorView = useMemo(
    () => [
      {
        key: <Typography>Name</Typography>,
        value: (
          <Grid item container className={classes.ItemWrapper} xs={12}>
            <OperatorDetails withCopy operator={operator} />
          </Grid>
        )
      },
      {
        key: (
          <Grid container item alignItems={'center'}>
            <Grid item style={{ marginTop: 1, marginRight: 4 }}>
              Status
            </Grid>
            <ToolTip text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'} />
          </Grid>
        ),
        value: (
          <Grid item container className={classes.ItemWrapper} xs={12}>
            <Status item={operator} />
          </Grid>
        )
      },
      {
        key: <Typography>Validators</Typography>,
        value: (
          <Grid item container className={classes.ItemWrapper} xs={12}>
            <Typography className={classes.TableValueText}>{validators_count}</Typography>
          </Grid>
        )
      },
      {
        key: <Typography>30D Performance</Typography>,
        value: (
          <Grid item container className={classes.ItemWrapper} xs={12}>
            <Typography className={classes.TableValueText}>{validators_count === 0 ? '- -' : validator30dPerformance}</Typography>
          </Grid>
        )
      }
    ],
    [operator, isDarkMode]
  );

  const data = useMemo(() => {
    // return validator operators mapped with additional fields fee and performance
    // @ts-ignore
    return operatorsValidators?.map((validator: any) => {
      // eslint-disable-next-line no-param-reassign
      const { public_key } = validator;

      return {
        status: <Status item={validator} />,
        public_key: (
          <Grid container style={{ alignItems: 'center', gap: 16 }}>
            <Typography className={classes.TableValueText}>{longStringShorten(public_key, 6, 4)}</Typography>
            <ImageDiv onClick={() => copyToClipboard(validator.public_key)} image={'copy'} width={20} height={20} />
          </Grid>
        ),
        extra_buttons: (
          <Grid item container className={classes.ExtraButtonWrapper}>
            <ImageDiv onClick={() => openExplorer(`validators/${validator.public_key}`, 'validator')} image={'explorer'} width={20} height={20} />
            <ImageDiv onClick={() => openBeaconcha(validator.public_key)} image={'beacon'} width={20} height={20} />
          </Grid>
        )
      };
    });
  }, [operatorsValidators, isDarkMode]);

  const columns = useMemo(
    () => [
      {
        id: 'col13',
        Header: (
          <Grid item container justifyContent={'space-between'} alignItems={'center'}>
            <Typography>Validators</Typography>
          </Grid>
        ),
        columns: [
          {
            Header: 'Address',
            accessor: 'public_key'
          },
          {
            Header: (
              <Grid container item alignItems={'center'}>
                <Typography onClick={() => sortValidatorsByStatus()} style={{ marginRight: 4, cursor: 'pointer' }}>
                  Status
                </Typography>
                <ToolTip
                  text={
                    'Refers to the validators status in the SSV network (not beacon chain),and reflects whether its operators are consistently performing their duties(according to the last 2 epochs)'
                  }
                />
              </Grid>
            ),
            accessor: 'status'
          },
          {
            Header: '',
            accessor: 'extra_buttons'
          }
        ]
      }
    ],
    [isDarkMode]
  );

  const backToClustersDashboard = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
  };

  const UpdateFeeButton = () =>
    !Number(operator.fee) ? (
      <Tooltip
        title={
          <Typography className={classes.UpdateFeeTooltipText}>
            Operators with a fee of 0 can not change their fee
            <LinkText className={classes.LinkText} text={'read more on operator fees'} link={config.links.MORE_ABOUT_UPDATE_FEES} />
          </Typography>
        }
        placement="top-end"
        children={
          <Grid item xs>
            <SecondaryButton isDisabled={!Number(operator.fee)} text={'Update Fee'} onClick={moveToUpdateFee} size={ButtonSize.XL} />
          </Grid>
        }
      />
    ) : (
      <SecondaryButton isDisabled={!Number(operator.fee)} text={'Update Fee'} onClick={moveToUpdateFee} size={ButtonSize.XL} />
    );

  return (
    <Grid container item style={{ gap: 26 }}>
      <NewWhiteWrapper type={WhiteWrapperDisplayType.OPERATOR} mainFlow stepBack={backToClustersDashboard} header={'Operator Details'}>
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
              sectionClass={classes.AnnualSection}
              body={[
                <Grid container item>
                  <Grid item xs={12}>
                    <SsvAndSubTitle ssv={formatNumberToUi(balance) || 0} bold leftTextAlign />
                  </Grid>
                </Grid>
              ]}
              bottom={[
                <Grid item xs>
                  <PrimaryButton text={'Withdraw'} onClick={moveToWithdraw} size={ButtonSize.XL} />
                </Grid>
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
                    <SsvAndSubTitle ssv={yearlyFee || 0} bold leftTextAlign />
                  </Grid>
                </Grid>
              ]}
              bottom={[<UpdateFeeButton />]}
              bottomWrapper={classes.ButtonSection}
              wrapperClass={classes.AnnualWrapper}
            />
          </Grid>
        </Grid>
        {validators_count === 0 && (
          <Grid container item className={classes.TableWrapper}>
            <Grid container item className={classes.BigBox}>
              <Grid item className={classes.NoValidatorImage} xs={12} />
              <Grid item xs={12}>
                <Typography className={classes.NoValidatorText}>No Validators</Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        {validators_count! > 0 && (
          <Grid item className={classes.OperatorsValidatorsTable}>
            <Table
              data={data}
              columns={columns}
              actionProps={{
                onChangePage,
                perPage: per_page as number,
                type: 'operator',
                currentPage: page,
                totalPages: pages,
                totalAmountOfItems: total,
                onChangeRowsPerPage
              }}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default observer(SingleOperator);
