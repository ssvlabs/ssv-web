import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from './Dashboard.styles';
import ToolTip from '~app/components/common/ToolTip';

type DashboardProps = {
  body: any[],
  headers: any[],
};

const Dashboard = (props: DashboardProps) => {
  const classes = useStyles();
  const { headers, body } = props;
  return (
      <Grid container>
        <Grid container item className={classes.HeadersWrapper}>
          {headers.map((header: any, index: number) => {
            return <Grid key={index} item className={`${classes.Header} ${classes.ToolTipWrapper}`}>
              <Typography>{header.name}</Typography>
              {header.tooltip && <ToolTip text={header.tooltip}/>}
            </Grid>;
          })}
        </Grid>
        <Grid container item className={classes.BodyWrapper}>
          {body.map((row: any) => Object.values(row))}
        </Grid>
      </Grid>
  );
};

export default observer(Dashboard);
