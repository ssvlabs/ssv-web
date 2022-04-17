import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Skeleton } from '@material-ui/lab';
import Table from '@material-ui/core/Table';
import { Grid, TableCell } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import ToolTip from '~app/common/components/ToolTip';
import TableContainer from '@material-ui/core/TableContainer';
// import TablePagination from '@material-ui/core/TablePagination';
import StyledCell from '~app/common/components/Table/StyledCell';
import PaginationActions from '~app/common/components/DataTable/components/PaginationActions';
import { useStyles } from './Styles';

type HeaderPosition = 'inherit' | 'left' | 'center' | 'right' | 'justify';

const TableContainerWrapper = styled.div`
  & .MuiInputBase-root {
    display: none;
  }`;

type DataTableProps = {
  title?: any,
  items: any[],
  type: string,
  perPage?: number,
  headers: string[],
  totalPages?: number,
  isLoading?: boolean,
  currentPage?: number,
  noDataMessage?: string,
  hidePagination?: boolean,
  totalAmountOfItems: number,
  headersPositions?: HeaderPosition[],
  // eslint-disable-next-line no-unused-vars
  onChangePage?: (props: { type: string, paginationPage?: number, force?: boolean }) => Promise<void>,
  // eslint-disable-next-line no-unused-vars
  onChangeRowsPerPage?: (type: string, perPage: any) => void,
};

const skeletons = [0, 1, 2, 3, 4];
// const defaultPerPageOptions = [5, 10, 25, 50, 100];

const DataTable = (props: DataTableProps) => {
  const { headers, type, items, totalAmountOfItems, currentPage, isLoading, totalPages,
    onChangePage, headersPositions, title, noDataMessage, hidePagination, perPage, onChangeRowsPerPage } = props;
  const classes = useStyles();
  const statusToolTipText = title === 'Operators' ?
      'Monitoring indication whether the operator is performing his network duties for the majority of his validators (per the last 2 epochs).' :
      'Refers to the validator’s status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties (according to the last 2 epochs).';

  const dataRows = () => {
    if (isLoading) {
      return skeletons.map((rowIndex: number) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={`row-${rowIndex}`}>
          {headers.map((header: string) => (
            <StyledCell key={`cell-${header}`}>
              <Skeleton />
            </StyledCell>
          ))}
        </TableRow>
      ));
    }
    if (!items?.length) {
      return (
        <TableRow hover role="checkbox" tabIndex={-1}>
          <StyledCell align="center" colSpan={headers?.length || 1}>
            {noDataMessage ?? 'No records'}
          </StyledCell>
        </TableRow>
      );
    }
    return items.map((row: any[], rowIndex: number) => (
      <TableRow hover role="checkbox" tabIndex={-1} key={`row-${rowIndex}`}>
        {row.map((cell: any, cellIndex: number) => (
          <StyledCell
            key={`cell-${cellIndex}`}
            align={headersPositions?.length ? headersPositions[cellIndex] : undefined}
              >
            <div style={{ height: 50 }}>
              {cell}
            </div>
          </StyledCell>
          ))}
      </TableRow>
    ));
  };

  return (
    <div className={classes.TableWithBorder}>
      <TableContainer>
        {title ? <Grid className={classes.TableHeader}>{title}</Grid> : ''}
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header: string, headerIndex: number) => (
                <TableCell
                  key={header}
                  className={classes.TableCell}
                  align={headersPositions?.length ? headersPositions[headerIndex] : undefined}
                >
                  <Typography component={'span'} className={classes.TableCellText}>{header}</Typography>
                  { header === 'Status' && <ToolTip text={statusToolTipText} />}
                </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows()}
          </TableBody>
        </Table>

        {/* /!* eslint-disable-next-line no-constant-condition *!/ */}
        {/* {!hidePagination && false && items?.length ? ( */}
        {/*  <TableContainerWrapper> */}
        {/*    <TablePagination */}
        {/*      page={currentPage} */}
        {/*      component="div" */}
        {/*      rowsPerPage={perPage} */}
        {/*      colSpan={headers.length} */}
        {/*      count={totalAmountOfItems} */}
        {/*      ActionsComponent={PaginationActions} */}
        {/*      rowsPerPageOptions={defaultPerPageOptions} */}
        {/*      onChangePage={(event: any, changedPage: number) => onChangePage ? onChangePage(changedPage) : null} */}
        {/*      onChangeRowsPerPage={(event: any) => onChangeRowsPerPage ? onChangeRowsPerPage(event.target.value) : null} */}
        {/*    /> */}
        {/*  </TableContainerWrapper> */}
        {/* ) : ''} */}
        {!hidePagination && (
        <TableContainerWrapper>
          <PaginationActions
            page={currentPage ?? 0}
            rowsPerPage={perPage ?? 0}
            totalPages={totalPages ?? 0}
            count={totalAmountOfItems}
            onChangePage={(changedPage: number) => onChangePage ? onChangePage({ type, paginationPage: changedPage }) : null}
            onChangeRowsPerPage={(rowNumber: number) => onChangeRowsPerPage ? onChangeRowsPerPage(type, rowNumber) : null}
          />
        </TableContainerWrapper>
        )}
      </TableContainer>
    </div>
  );
};

export default observer(DataTable);
