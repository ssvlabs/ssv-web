import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/common/components/Status';
// import { longStringShorten } from '~lib/utils/strings';
// `0x${longStringShorten('998b01f35508d35db7804bb56c9e4d7122558cb981382487f11dd808b49f2b9cdaa0e21c38230b0dd8663e6743e2ec4d', 4)}`
import LinkText from '~app/common/components/LinkText';
import ToolTip from '~app/common/components/ToolTip/ToolTip';
import BackNavigation from '~app/common/components/BackNavigation';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { Table } from '~app/common/components/Table/Table';
import { useStyles } from '~app/components/MyAccount/components/SingelValidator/SingelValidator.styles';
import OperatorDetails from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import { longStringShorten } from '~lib/utils/strings';

const SingleValidator = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    // @ts-ignore
    const { public_key } = useParams();
    const settingsRef = useRef(null);
    const [validator, setValidator] = useState(null);
    const applicationStore: ApplicationStore = stores.Application;
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        applicationStore.setIsLoading(true);
        Validator.getInstance().getValidator(public_key).then((response: any) => {
            if (response) {
                response.public_key = longStringShorten(public_key, 6, 4);
                response.total_operators_fee = response.operators.reduce((acc: number, operator: any) => {
                    return acc + operator.fee;
                }, 0);
                setValidator(response);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        /**
         * Close menu drop down when click outside
         */
        const handleClickOutside = (e: any) => {
            // @ts-ignore
            if (showSettings && settingsRef.current && (!settingsRef.current.contains(e.target))) {
                setShowSettings(false);
            }
        };
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [settingsRef, showSettings]);

    const fields = [
        { key: 'public_key', value: 'Address' },
        { key: 'status', value: 'Status' },
        { key: 'balance', value: 'Balance' },
        { key: 'apr', value: 'Est. APR' },
        { key: 'total_operators_fee', value: 'Total Operators Fee' },
    ];
    const removeValidatorPage = () => {
        history.push(`/dashboard/validator/${public_key}/remove`);
    };

    const ShowSettings = () => {
        if (!showSettings) return null;
        return (
          <Grid ref={settingsRef} container item className={classes.Settings}>
            <Grid item className={classes.Button} onClick={removeValidatorPage}>Remove Validator</Grid>
          </Grid>
        );
    };

    const data = React.useMemo(
        () => {
            // return validator operators mapped with additional fields fee and performance
            // @ts-ignore
            return validator?.operators?.map((operator: any) => {
                // eslint-disable-next-line no-param-reassign
                operator.performance = operator.performances['24hours'] || '0%';
                const {
                    fee,
                    name,
                    type,
                    status,
                    address,
                    performance,
                } = operator;

                return {
                    public_key: <OperatorDetails operator={{
                        status,
                        name,
                        type,
                        address,
                        fee,
                    }} />,
                    status: <Status status={status} />,
                    performance,
                    fee: <Grid item container justify={'space-between'}>
                      <Grid item container xs>
                        <Grid item xs={12}>
                          <Typography>{operator.fee} SSV</Typography>
                        </Grid>
                        <Grid item>~$757.5</Grid>
                      </Grid>
                      <Grid className={classes.ExplorerImage} onClick={() => { window.open(`${config.links.LINK_EXPLORER}/operators/${address}`); }} />
                    </Grid>,
                };
            });
        },
        [validator],
    );
    const editValidator = () => {
        history.push(`/dashboard/validator/${public_key}/edit`);
    };
    
    const columns = React.useMemo(
        () => [
            {
                id: 'col13',
                Header: <Grid container justify={'space-between'} alignItems={'center'}>
                  <Typography>My Operators</Typography>
                  <Grid item className={classes.Edit} onClick={editValidator}>Edit</Grid>
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
                          <ToolTip text={'this is a tool tip!!'} />
                        </Grid>,
                        accessor: 'status',
                    },
                    {
                        Header: '1D Performance',
                        accessor: 'performance',
                    },
                    {
                        Header: 'Yearly Fee',
                        accessor: 'fee',
                    },
                ],
            },
        ], [],
    );

    if (!validator) return null;

    return (
      <Grid container className={classes.SingleValidatorWrapper}>
        <Grid item container className={classes.FirstSectionWrapper}>
          <Grid item container>
            <Grid item xs={12}>
              <BackNavigation />
            </Grid>
            <Grid item container xs={12} className={classes.HeaderWrapper}>
              <Grid item xs>
                <Typography className={classes.Header}>Validator Details</Typography>
              </Grid>
              <Grid item className={classes.Options} onClick={() => { setShowSettings(!showSettings); }} />
            </Grid>

            <Grid item container className={classes.FieldsWrapper}>
              {fields.map((field: { key: string, value: string }, index: number) => {
                  // @ts-ignore
                  const fieldKey = validator[field.key];
                  return (
                    <Grid key={index} item>
                      <Grid className={classes.DetailsHeader}>{field.value}</Grid>
                      <Grid className={classes.DetailsBody}>{field.key === 'status' ?
                        <Status status={fieldKey} /> : fieldKey}</Grid>
                    </Grid>
                    );
                })}
            </Grid>
            <Grid item className={classes.SettingsWrapper}>
              <ShowSettings />
            </Grid>
            <Grid item container className={classes.Links}>
              <LinkText text={'Explorer'} link={'https://www.google.com'} />
              <Grid item className={classes.BlueExplorerImage} />
              <LinkText text={'Beaconcha'} link={'https://www.google.com'} />
              <Grid item className={classes.BeaconImage} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item container className={classes.SecondSectionWrapper}>
          <Grid item className={classes.OperatorsWrapper}>
            <Table columns={columns} data={data} hideActions />
          </Grid>
        </Grid>
      </Grid>
    );
};

export default observer(SingleValidator);