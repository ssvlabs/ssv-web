import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useStyles } from './Filters.styles';

type Props = {
    setFilterBy: any;
};

const Filters = (props: Props) => {
    const classes = useStyles();
    const wrapperRef = useRef(null);
    const [shouldOpen, openPopUp] = useState(false);
    const [verifySelected, selectVerify] = useState(false);
    const [dappNodeSelected, selectDappNode] = useState(false);

    useEffect(() => {
        const filters = [];
        if (verifySelected) filters.push('verified_operator');
        if (dappNodeSelected) filters.push('dapp_node');
        props.setFilterBy(filters);
    }, [verifySelected, dappNodeSelected]);

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
    if (dappNodeSelected) filterSelected += 1;

    return (
      <Grid item container ref={wrapperRef}
        className={`${classes.FiltersWrapper} ${filterSelected > 0 ? classes.Bold : ''}`} onClick={openPopup}>
        <Grid item className={classes.FilterImg} />
        <Grid item className={classes.FilterText}>Filters</Grid>
        {filterSelected > 0 && <Grid item className={classes.FilterTextBlue}>{filterSelected}</Grid>}
        {shouldOpen && (
        <Grid container className={classes.Popup}>
          <Grid item container xs={12} onClick={() => selectVerify(!verifySelected)} className={classes.Item}>
            <Grid item className={`${classes.Checkbox} ${verifySelected ? classes.Checked : ''}`} />
            <Grid item className={classes.Text}>Verified</Grid>
          </Grid>
          <Grid item container xs={12} onClick={() => selectDappNode(!dappNodeSelected)}
            className={classes.Item}>
            <Grid item className={`${classes.Checkbox} ${dappNodeSelected ? classes.Checked : ''}`} />
            <Grid item className={classes.Text}>DappNode</Grid>
          </Grid>
        </Grid>
        )}
      </Grid>
    );
};

export default observer(Filters);
