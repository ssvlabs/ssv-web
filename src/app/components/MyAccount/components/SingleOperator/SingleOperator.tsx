import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/common/components/Status';
import Button from '~app/common/components/Button';
import { longStringShorten } from '~lib/utils/strings';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import { Table } from '~app/common/components/Table/Table';
import ToolTip from '~app/common/components/ToolTip/ToolTip';
import OperatorType from '~app/common/components/OperatorType';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from '~app/components/MyAccount/components/SingleOperator/SingleOperator.styles';

const SingleOperator = () => {
    const stores = useStores();
    const history = useHistory();
    // @ts-ignore
    const { operator_id } = useParams();
    const beaconchaBaseUrl = getBaseBeaconchaUrl();
    const [operator, setOperator] = useState(null);
    const [operatorsValidators, setOperatorsValidators] = useState([]);
    const [operatorsValidatorsPagination, setOperatorsValidatorsPagination] = useState(null);
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;

    useEffect(() => {
        applicationStore.setIsLoading(true);
        Operator.getInstance().getOperator(operator_id).then((response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
                const operatorId = response.operator_id;
                Operator.getInstance().getOperatorValidators({
                    operatorId,
                    page: 1,
                    perPage: 5,
                }).then((validatorsResponse: any) => {
                    if (response) {
                        setOperatorsValidators(validatorsResponse.validators);
                        setOperatorsValidatorsPagination(validatorsResponse.pagination);
                    }
                });
            }
        });
    }, []);

    // @ts-ignore
    const { page, pages, perPage, total } = operatorsValidatorsPagination || {};
    // @ts-ignore
    const { name, logo, type, status, address, validators_count, fee } = operator || {};
    const classes = useStyles({ operatorLogo: logo, noValidators: operatorsValidators.length === 0 });

    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const openExplorer = (key: string) => {
        window.open(`${config.links.LINK_EXPLORER}/${key}`, '_blank');
    };

    const openBeaconcha = (publicKey: string) => {
        window.open(`${beaconchaBaseUrl}/validator/${publicKey}`, '_blank');
    };

    const operatorView = React.useMemo(
        () => [
            {
                key: <Typography>Name</Typography>,
                value: <Grid item container className={classes.ItemWrapper} xs={12}>
                  <Grid item className={classes.OperatorLogo} />
                  <Typography className={classes.TableValueText}>{name}</Typography>
                  <OperatorType type={type} />
                </Grid>,
            },
            {
                key: <Typography>Address</Typography>,
                value: <Grid item container className={classes.ItemWrapper} xs={12}>
                  <Typography
                    className={classes.TableValueText}>{`0x${longStringShorten(address, 4, 4)}`}</Typography>
                  <ImageDiv onClick={() => copyToClipboard(address)} image={'copy'} width={24} height={24} />
                  <ImageDiv onClick={() => openExplorer(`operators/${address}`)} image={'explorer'} width={24}
                    height={24} />
                </Grid>,
            },
            {
                key: <Grid container item alignItems={'center'}>
                  <Grid item style={{ marginRight: 4 }}>
                    Status
                  </Grid>
                  <ToolTip
                    text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'} />
                </Grid>,
                value: <Grid item container className={classes.ItemWrapper} xs={12}>
                  <Status status={status} />
                </Grid>,
            },
            {
                key: <Typography>Validators</Typography>,
                value: <Grid item container className={classes.ItemWrapper} xs={12}>
                  <Typography className={classes.TableValueText}>{validators_count}</Typography>
                </Grid>,
            },
            {
                key: <Typography>Revenue</Typography>,
                value: <Grid item container className={classes.ItemWrapper} xs={12}>
                  <SsvAndSubTitle leftTextAlign ssv={15.14} subText={'~$24.94'} />
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
                    status: <Status status={'inactive'} />,
                    public_key: <Typography
                      className={classes.TableValueText}>{`0x${longStringShorten(public_key, 6, 4)}`}</Typography>,
                    extra_buttons: <Grid item container className={classes.ExtraButtonWrapper}>
                      <ImageDiv onClick={() => copyToClipboard(validator.public_key)} image={'copy'} width={20}
                        height={20} />
                      <ImageDiv onClick={() => openExplorer(`validators/${validator.public_key}`)} image={'explorer'}
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
                Header: <Grid item container justify={'space-between'} alignItems={'center'}>
                  <Typography>Validators</Typography>
                </Grid>,
                columns: [
                    {
                        Header: 'Address',
                        accessor: 'public_key',
                    },
                    {
                        Header: <Grid container item alignItems={'center'}>
                          <Grid item style={{ marginRight: 4 }}>
                            Status
                          </Grid>
                          <ToolTip
                            text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'} />
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

    if (!operator) return null;

    return (
      <Grid container item>
        <WhiteWrapper
          withSettings={{
                    text: 'Remove Operator',
                    onClick: () => {
                        history.push(`/dashboard/operator/${operator_id}/remove`);
                    },
                }}
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
        </WhiteWrapper>
        <Grid container item className={classes.SecondSectionWrapper}>
          {operatorsValidators && operatorsValidators.length > 0 && (
            <Grid item className={classes.OperatorsValidatorsTable}>
              <Table columns={columns} data={data} actionProps={{
                            perPage,
                            type: 'operator',
                            currentPage: page,
                            totalPages: pages,
                            onChangePage: () => {
                            },
                            totalAmountOfItems: total,
                            onChangeRowsPerPage: () => {
                            },
                        }}
              />
            </Grid>
          )}
          {operatorsValidatorsPagination && operatorsValidators.length === 0 && (
          <Grid item className={classes.OperatorsValidatorsTable}>
            <Grid item xs={12} className={classes.NoRecordImage} />
            <Grid item xs={12} className={classes.NoRecordsText}>No Validators</Grid>
          </Grid>
            //     <Grid hover>
            //     <StyledCell className={classes.NoRecordsWrapper}>
            //         <Grid container>
            //             <Grid item xs={12} className={classes.NoRecordImage}/>
            //             <Grid item xs={12} className={classes.NoRecordsText}>No results found</Grid>
            //             <Grid item xs={12} className={classes.NoRecordsText}>Please try different keyword or
            //                 filter</Grid>
            //         </Grid>
            //     </StyledCell>
            // </TableRow>
            )}

          <Grid item className={classes.AnnualWrapper}>
            <BorderScreen
              withoutNavigation
              header={'Annual Fee'}
              body={[
                <Grid container item style={{ gap: 20 }}>
                  <Grid item xs={12}>
                    <SsvAndSubTitle ssv={fee || 0} bold leftTextAlign subText={'~$76.78'} />
                  </Grid>
                </Grid>,
              ]}
              bottom={[
                <Grid item xs>
                  <Button disable={false} text={'Change Fee'} onClick={console.log} />
                </Grid>,
              ]}
              bottomWrapper={classes.ButtonSection}
              wrapperClass={classes.AnnualWrapper}
            />
          </Grid>
        </Grid>
      </Grid>
    );
};

export default observer(SingleOperator);