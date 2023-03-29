import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStyles } from './ClusterWarnings.styles';
import LinkText from '~app/components/common/LinkText';

const ClusterWarnings = ({ cluster }: { cluster: any }) => {
  const classes = useStyles();
  const warningTimeoutRef = useRef(null);
  const [showPopUp, setShowPopUp] = useState(false);

  const handleWarningLeave = () => {
    // @ts-ignore
    clearTimeout(warningTimeoutRef.current);
    // @ts-ignore
    warningTimeoutRef.current = setTimeout(() => {
      setShowPopUp(false);
    }, 300);

  };

  const handleWarningHover = () => {
    // @ts-ignore
    clearTimeout(warningTimeoutRef.current);
    // @ts-ignore
    warningTimeoutRef.current = setTimeout(() => {
      setShowPopUp(true);
    }, 300);
  };


  if (cluster.isLiquidated) {
    return (
        <Grid
            className={classes.Liquidated}
            onMouseLeave={handleWarningLeave}
            onMouseEnter={handleWarningHover}>
          Liquidated
          {showPopUp && <Grid container className={classes.LiquidatedPopUpWrapper}>
            <Grid item className={classes.PopUpText}>
              Your cluster has been liquidated. To resume your validators operation please reactive your cluster.
            </Grid>
            <LinkText className={classes.LiquidationLink} withoutUnderline text={'Learn more on liquidations'} link={'asdas'} />
          </Grid>}
        </Grid>
    );
  }

  if (cluster.runWay < 30) {
    return (
        <Grid
            className={classes.LowRunWay}
            onMouseLeave={handleWarningLeave}
            onMouseEnter={handleWarningHover}>
          Low Runway
          {showPopUp && <Grid container className={classes.LowRunWayPopUpWrapper}>
            <Grid item className={classes.PopUpText}>
              Your balance is running low and puts your cluster at risk. To avoid liquidation please top up your cluster balance by depositing more funds.
            </Grid>
            <LinkText className={classes.LiquidationLink} withoutUnderline text={'Learn more on liquidations'} link={'asdas'} />
          </Grid>}
        </Grid>
    );
  }

  return null;
};

export default observer(ClusterWarnings);
