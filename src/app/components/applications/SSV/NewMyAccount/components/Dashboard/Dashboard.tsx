import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from './Dashboard.styles';
import ToolTip from '~app/components/common/ToolTip';
// import { ReactTable } from '~app/components/common/ReactTable';

type DashboardProps = {
  body: any[],
  headers: any[],
};

const Dashboard = (props: DashboardProps) => {
  const classes = useStyles();
  const { headers, body } = props;
  // const validatorsData = [1]?.map(() => {
  //   return {
  //     public_key: <Grid container item>
  //      sad
  //     </Grid>,
  //   };
  // });
  //
  // const validatorsColumns = [
  //   {
  //     id: 'col14',
  //     columns: [
  //       {
  //         Header: 'Public key',
  //         accessor: 'public_key',
  //         width: 60,
  //       },
  //     ],
  //   },
  // ];
  //
  // return (
  //     <Grid container>
  //       <Grid item xs={12} style={{ marginBottom: 20 }}>
  //         <ReactTable
  //             data={validatorsData}
  //             cols={validatorsColumns}
  //             loading={false}
  //         />
  //       </Grid>
  //     </Grid>
  // );
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
          {body.map((row: any[], index: number) => {
            return <Grid key={index} container item className={classes.BodyRowWrapper}>
              {row.map((column) => column)}
              <Grid item className={classes.SingleItemArrow} />
            </Grid>;
          })}
        </Grid>
      </Grid>
  );
};

export default observer(Dashboard);
