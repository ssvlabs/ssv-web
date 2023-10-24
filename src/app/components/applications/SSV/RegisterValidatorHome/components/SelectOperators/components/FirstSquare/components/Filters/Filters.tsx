import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import CheckBox from '~app/components/common/CheckBox';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/Filters/Filters.styles';

type Props = {
  setFilterBy: any;
  selectDkgEnabled: Function;
  dkgEnabled: boolean;
};

const Filters = (props: Props) => {
  const classes = useStyles();
  const wrapperRef = useRef(null);
  const [shouldOpen, openPopUp] = useState(false);
  const [verifySelected, selectVerify] = useState(false);
  // const [dappNodeSelected, selectDappNode] = useState(false);

  useEffect(() => {
    const filters = [];
    if (verifySelected) {
      filters.push('verified_operator');
    }
    // if (dappNodeSelected) {
    //   filters.push('dapp_node');
    // }
    props.setFilterBy(filters);
  }, [verifySelected, props.dkgEnabled]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      // @ts-ignore
      if (shouldOpen && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        openPopUp(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, shouldOpen]);

  const openPopup = () => {
    openPopUp(!shouldOpen);
  };

  let filterSelected = 0;
  if (verifySelected) filterSelected += 1;
  // if (dappNodeSelected) filterSelected += 1;

  return (
    <Grid item container ref={wrapperRef}
      className={`${classes.FiltersWrapper} ${filterSelected > 0 ? classes.Bold : ''}`} onClick={openPopup}>
      <Grid item className={classes.FilterImg} />
      <Grid item className={classes.FilterText}>Filters</Grid>
      {filterSelected > 0 && <Grid item className={classes.FilterTextBlue}>{filterSelected}</Grid>}
      {shouldOpen && (
        <Grid container className={classes.Popup}>
          <CheckBox
            width={24}
            height={24}
            isChecked={verifySelected}
            onClickCallBack={() => {
              GoogleTagManager.getInstance().sendEvent({
                category: 'validator_register',
                action: 'filter',
                label: 'verified_operator',
              });
              selectVerify(!verifySelected);
            }}
            text={<Grid item className={classes.Text}>Verified</Grid>}
          />
          <CheckBox
            width={24}
            height={24}
            isChecked={props.dkgEnabled}
            onClickCallBack={() => {
              GoogleTagManager.getInstance().sendEvent({
                category: 'validator_register',
                action: 'filter',
                label: 'dkg_enabled',
              });
              props.selectDkgEnabled(!props.dkgEnabled);
            }}
            text={<Grid item className={classes.Text}>DKG Enabled</Grid>}
          />
          {/*<CheckBox*/}
          {/*  width={24}*/}
          {/*  height={24}*/}
          {/*  isChecked={dappNodeSelected}*/}
          {/*  onClickCallBack={() => {*/}
          {/*    GoogleTagManager.getInstance().sendEvent({*/}
          {/*      category: 'validator_register',*/}
          {/*      action: 'filter',*/}
          {/*      label: 'dapp_node',*/}
          {/*    });*/}
          {/*    selectDappNode(!dappNodeSelected);*/}
          {/*  }}*/}
          {/*  text={<Grid item className={classes.Text}>DappNode</Grid>}*/}
          {/*/>*/}
          {/* <Grid item className={`${classes.Checkbox} ${verifySelected ? classes.Checked : ''}`} /> */}
          {/* <Grid item className={classes.Text}>Verified</Grid> */}
          {/* <Grid item container xs={12} onClick={() => selectDappNode(!dappNodeSelected)} */}
          {/*  className={classes.Item}> */}
          {/*  <Grid item className={`${classes.Checkbox} ${dappNodeSelected ? classes.Checked : ''}`} /> */}
          {/*  <Grid item className={classes.Text}>DappNode</Grid> */}
          {/* </Grid> */}
        </Grid>
      )}
    </Grid>
  );
};

export default observer(Filters);
