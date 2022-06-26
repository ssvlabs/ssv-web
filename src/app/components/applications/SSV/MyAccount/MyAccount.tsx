import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect, useRef } from 'react';
import config from '~app/common/config';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import MyBalance from '~app/components/applications/SSV/MyAccount/components/MyBalance';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import DashboardTables from '~app/components/applications/SSV/MyAccount/components/DashboardTables';
import { useStyles } from './MyAccount.styles';

const MyAccount = () => {
    const classes = useStyles();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const wrapperRef = useRef(null);
    const { redirectUrl, history } = useUserFlow();
    const [dropDownMenu, displayDropDownMenu] = useState(false);
    const liquidated = ssvStore.userLiquidated && ssvStore.isValidatorState;

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

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
              <Typography className={classes.AddButtonText}>+ Add</Typography>
              {dropDownMenu && (
                <Grid container className={classes.AddButtonDropDown}>
                  <Grid item xs={12}
                    className={`${classes.AddButtonDropDownItem} ${liquidated ? classes.Disable : ''}`}
                    onClick={() => { !liquidated && history.push(config.routes.SSV.VALIDATOR.HOME); }}>Run Validator</Grid>
                  <Grid item xs={12}
                    className={classes.AddButtonDropDownItem}
                    onClick={() => { history.push(config.routes.SSV.OPERATOR.HOME); }}>
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
          <Grid item className={classes.TablesWrapper}>
            <DashboardTables />
          </Grid>
        </Grid>
      </Grid>
    );
};

export default observer(MyAccount);
