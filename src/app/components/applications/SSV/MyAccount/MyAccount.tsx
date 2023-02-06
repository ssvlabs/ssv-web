 import { observer } from 'mobx-react';
 import Grid from '@mui/material/Grid';
 import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import config from '~app/common/config';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import MyBalance from '~app/components/applications/SSV/MyAccount/components/MyBalance';
import DashboardTables from '~app/components/applications/SSV/MyAccount/components/DashboardTables';
import { useStyles } from './MyAccount.styles';

const MyAccount = () => {
  const classes = useStyles();
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const wrapperRef = useRef(null);
  const { redirectUrl, navigate } = useUserFlow();
  const [dropDownMenu, displayDropDownMenu] = useState(false);
  const liquidated = ssvStore.userLiquidated && ssvStore.isValidatorState;

  const addMethod = (isOperator?: boolean) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'my_account',
      action: 'add',
      label: isOperator ? 'operator' : 'validator',
    });
    if (isOperator) {
      navigate(config.routes.SSV.OPERATOR.HOME);
    } else if (!isOperator && !liquidated) navigate(config.routes.SSV.VALIDATOR.HOME);
  };

  useEffect(() => {
    redirectUrl && navigate(redirectUrl);
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
      <Grid container item xs={12} className={classes.Header} justifyContent={'space-between'}>
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
          <Grid ref={wrapperRef} className={classes.AddButton} onClick={() => {
            displayDropDownMenu(!dropDownMenu);
          }}>
            <Typography className={classes.AddButtonText}>+ Add</Typography>
            {dropDownMenu && (
              <Grid container className={classes.AddButtonDropDown}>
                <Grid item xs={12}
                  className={`${classes.AddButtonDropDownItem} ${liquidated ? classes.Disable : ''}`}
                  onClick={() => {
                        addMethod(false);
                      }}>Run Validator</Grid>
                <Grid item xs={12}
                  className={classes.AddButtonDropDownItem}
                  onClick={() => {
                        addMethod(true);
                      }}>
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
