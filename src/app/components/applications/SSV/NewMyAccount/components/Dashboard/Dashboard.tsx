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
import PaginationActions, { TablePaginationActionsProps } from '~app/components/common/Table/PaginationActions/PaginationActions';

type DashboardProps = {
  rows: any[],
  columns: any[],
  disable: boolean,
  rowsAction?: any,
  loading?: boolean,
  noItemsText: string,
  header?: JSX.Element,
  headerPadding?: number,
  // eslint-disable-next-line no-unused-vars
  extraActions?: (item: any) => JSX.Element,
  paginationActions: TablePaginationActionsProps
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
  vertical-align: top;
  letter-spacing: normal;
  padding: 20px 26px 20px 32px;
  color: ${props => props.theme.colors.black};
`;

const CustomizedBasicRow = styled(TableRow)`
  padding: 40px;
`;

const ContainerHeader = styled(Grid)`
  align-items: center;
  padding: 20px 26px 0px 32px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const CustomizedColumnRow = styled(CustomizedBasicRow)`
  height: 65px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
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
  const { columns, rows, rowsAction, noItemsText, paginationActions, header, extraActions, headerPadding, loading } = props;
  console.log('<<<<<<<<<<<<<<<<<<<<<<<here>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(paginationActions);
  console.log(paginationActions.totalPages);
  console.log('<<<<<<<<<<<<<<<<<<<<<<<here>>>>>>>>>>>>>>>>>>>>>>>');
  const classes = useStyles({ header, headerPadding });

  return (
      <TableContainer style={{ overflowX: 'unset' }}>
        {header && <ContainerHeader className={classes.HeaderColor}>{header}</ContainerHeader>}
        <CustomizedTable sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <CustomizedColumnRow className={classes.HeaderColor}>
              {columns.map((column: any, index: number) => {
                return <CustomizedCellBasic className={classes.HeaderColumn} key={index}>
                  <Grid container item className={`${classes.Header} ${classes.ToolTipWrapper}`}>
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
                    onClick={()=>{rowsAction && rowsAction(index);}}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {Object.keys(row).map((key: string, secondIndex: number) => (
                      <CustomizedCellBasic className={classes.BodyColumn} key={secondIndex} align="left" component="th" scope="row">
                        {row[key]}
                      </CustomizedCellBasic>
                  ))}
                  {!extraActions && <CustomizedCellBasic align="right">
                    <Grid className={classes.Arrow}/>
                  </CustomizedCellBasic>}
                  {extraActions && <CustomizedCellBasic>{extraActions(index)}</CustomizedCellBasic>}
                </CustomizedBodyRow>
            ))}
          </TableBody>
        </CustomizedTable>
        {paginationActions.totalPages > 1 && <PaginationActions {...paginationActions} />}
        {rows.length === 0 && !loading && <Grid container item className={classes.TableWrapper}>
          <Grid container item className={classes.BigBox}>
            <Grid item className={classes.NoValidatorImage} xs={12} />
            <Grid item xs={12} className={classes.NoValidatorText}>{noItemsText}</Grid>
          </Grid>
        </Grid>}
      </TableContainer>
  );
};

export default observer(Dashboard);
