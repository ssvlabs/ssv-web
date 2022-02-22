import React from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '~app/common/components/NewDataTable/NewDataTable.styles';

type DataTableProps = {
    header: string,
    columnsHeaders: any[],
};

const NewDataTable = (props: DataTableProps) => {
    const { columnsHeaders, header } = props;
    const classes = useStyles();

    return (
      <Grid container className={classes.Wrapper}>
        <Grid item xs={12} className={classes.Header}>
          <Typography>{header}</Typography>
        </Grid>
        <Grid item xs>
          <table>
            <tr className={classes.Row}>
              {columnsHeaders.map((columnHeader) => {
                          return <th>{columnHeader}</th>;
                      })}
            </tr>
          </table>
        </Grid>
      </Grid>
    );
};

export default NewDataTable;
