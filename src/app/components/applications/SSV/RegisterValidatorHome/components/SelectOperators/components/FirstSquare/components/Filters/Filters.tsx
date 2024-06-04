import { useEffect, useRef, useState } from 'react';
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

const Filters = ({ setFilterBy, selectDkgEnabled, dkgEnabled }: Props) => {
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
    setFilterBy(filters);
  }, [verifySelected, dkgEnabled]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      // @ts-ignore
      if (
        shouldOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
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
  if (dkgEnabled) filterSelected += 1;

  return (
    <Grid
      item
      container
      ref={wrapperRef}
      className={`${classes.FiltersWrapper} ${filterSelected > 0 ? classes.Bold : ''}`}
      onClick={openPopup}
    >
      <Grid item className={classes.FilterImg} />
      <Grid item className={classes.FilterText}>
        Filters
      </Grid>
      {filterSelected > 0 && (
        <Grid item className={classes.FilterTextBlue}>
          {filterSelected}
        </Grid>
      )}
      {shouldOpen && (
        <Grid container className={classes.Popup}>
          <CheckBox
            width={24}
            height={24}
            isChecked={verifySelected}
            toggleIsChecked={() => {
              GoogleTagManager.getInstance().sendEvent({
                category: 'validator_register',
                action: 'filter',
                label: 'verified_operator'
              });
              selectVerify(!verifySelected);
            }}
            text={
              <Grid item className={classes.Text}>
                Verified
              </Grid>
            }
          />
          <CheckBox
            width={24}
            height={24}
            isChecked={dkgEnabled}
            toggleIsChecked={() => {
              GoogleTagManager.getInstance().sendEvent({
                category: 'validator_register',
                action: 'filter',
                label: 'dkg_enabled'
              });
              selectDkgEnabled(!dkgEnabled);
            }}
            text={
              <Grid item className={classes.Text}>
                DKG Enabled
              </Grid>
            }
          />
        </Grid>
      )}
    </Grid>
  );
};

export default observer(Filters);
