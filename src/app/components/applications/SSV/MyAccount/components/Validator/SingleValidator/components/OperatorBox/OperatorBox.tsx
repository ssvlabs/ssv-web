import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStyles } from './OperatorBox.styles';
import Status from '~app/components/common/Status';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const OperatorBox = ({ operator }: { operator: any }) => {
  const classes = useStyles();

  if (operator === null) return <Grid item className={classes.OperatorBox} />;

  return (
      <Grid item className={classes.OperatorBox}>
        <Grid className={classes.FirstSectionOperatorBox}>
          <OperatorDetails operator={operator}/>
        </Grid>
        <Grid container item className={classes.SecondSectionOperatorBox}>
          <Grid item container xs className={classes.ColumnWrapper}>
            <Grid container item style={{ gap: 6, alignItems: 'center' }}>
              <Grid item>
                Status
              </Grid>
              <ToolTip
                  text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'}/>
            </Grid>
            <Status status={operator.status} />
          </Grid>
          <Grid item container xs className={classes.ColumnWrapper}>
            <Grid container item>
              <Grid item>
                30D Perform.
              </Grid>
            </Grid>
            <Grid>97.9%</Grid>
          </Grid>
          <Grid item container xs className={classes.ColumnWrapper}>
            <Grid container item>
              <Grid item>
                Yearly Fee
              </Grid>
            </Grid>
            25 SSV
          </Grid>
          {/*<Grid item>*/}
          {/*  <Grid container item alignItems={'center'}>*/}
          {/*    <Grid item>*/}
          {/*      30D perform.*/}
          {/*    </Grid>*/}
          {/*  </Grid>*/}
          {/*</Grid>*/}
          {/*<Grid item>*/}
          {/*  <Grid container item alignItems={'center'}>*/}
          {/*    <Grid item>*/}
          {/*      Yearly Fee*/}
          {/*    </Grid>*/}
          {/*  </Grid>*/}
          {/*</Grid>*/}
        </Grid>
      </Grid>

  );
};

export default observer(OperatorBox);
