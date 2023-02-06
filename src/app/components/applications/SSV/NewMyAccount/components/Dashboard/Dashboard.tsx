import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { useStyles } from './Dashboard.styles';
import ToolTip from '~app/components/common/ToolTip';
import PaginationActions from '~app/components/common/Table/PaginationActions';
// import { ReactTable } from '~app/components/common/ReactTable';

type DashboardProps = {
  rows: any[],
  columns: any[],
  rowsAction: any,
};

const CustomizedTable = styled(Table)`
  border-radius: 16px;
`;


const CustomizedCellBasic = styled(TableCell)`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.62;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  padding: 20px 26px 20px 32px;
  vertical-align: top;
  color: ${props => props.theme.colors.black};
`;

const CustomizedBasicRow = styled(TableRow)`
  padding: 40px;
`;

const CustomizedColumnRow = styled(CustomizedBasicRow)`
  height: 65px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background-color: ${props => props.theme.colors.gray0};
  border-bottom: solid 1px ${props => props.theme.colors.gray20};
`;

const CustomizedBodyRow = styled(CustomizedBasicRow)`
  height: 80px;
  cursor: pointer;
  background-color: ${props => props.theme.colors.white};

  :hover {
    box-shadow: 0 6px 28px 0 rgba(0, 0, 0, 0.06);
    background-color: ${props => props.theme.colors.gray10};
    & div[class*="makeStyles-Arrow-"] {
      background-image: url(/images/view_arrow/blue.svg);
    }
  }
`;

const Dashboard = (props: DashboardProps) => {
  const classes = useStyles();
  const { columns, rows, rowsAction } = props;

  return (
      <TableContainer>
        <CustomizedTable sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <CustomizedColumnRow>
              {columns.map((column: any, index: number) => {
                return <CustomizedCellBasic key={index}>
                  <Grid item className={`${classes.Header} ${classes.ToolTipWrapper}`}>
                    <Typography>{column.name}</Typography>
                    {column.tooltip && <ToolTip text={column.tooltip}/>}
                  </Grid>
                </CustomizedCellBasic>;
              })}
              <CustomizedCellBasic />
            </CustomizedColumnRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index: number) => (
                <CustomizedBodyRow
                    key={index}
                    onClick={()=>{rowsAction(index);}}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {Object.keys(row).map((key: string, secondIndex: number) => (
                      <CustomizedCellBasic key={secondIndex} align="left" component="th" scope="row">
                        {row[key]}
                      </CustomizedCellBasic>
                  ))}
                  <CustomizedCellBasic align="right">
                    <Grid className={classes.Arrow}/>
                  </CustomizedCellBasic>
                </CustomizedBodyRow>
            ))}
          </TableBody>
        </CustomizedTable>
        <PaginationActions
            page={1}
            rowsPerPage={5}
            totalPages={10}
            count={10}
            onChangePage={console.log}
            onChangeRowsPerPage={console.log}
        />
      </TableContainer>
  );

  // return (
  //     <Grid container>
  //       <Grid container item className={classes.HeadersWrapper}>
  //         {headers.map((header: any, index: number) => {
  //           return <Grid key={index} item className={`${classes.Header} ${classes.ToolTipWrapper}`}>
  //             <Typography>{header.name}</Typography>
  //             {header.tooltip && <ToolTip text={header.tooltip}/>}
  //           </Grid>;
  //         })}
  //       </Grid>
  //       <Grid container item className={classes.BodyWrapper}>
  //         {body.map((row: any[], index: number) => {
  //           return <Grid key={index} container item className={classes.BodyRowWrapper}>
  //             {row.map((column) => column)}
  //             <Grid item className={classes.SingleItemArrow} />
  //           </Grid>;
  //         })}
  //       </Grid>
  //     </Grid>
  // );
};

export default observer(Dashboard);
