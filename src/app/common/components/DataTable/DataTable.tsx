import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Skeleton } from '@material-ui/lab';
import Table from '@material-ui/core/Table';
import { TableCell } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import ToolTip from '~app/common/components/ToolTip';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import StyledRow from '~app/common/components/Table/StyledRow';
import StyledCell from '~app/common/components/Table/StyledCell';
import PaginationActions from '~app/common/components/DataTable/components/PaginationActions';
import { useStyles } from './Styles';

type HeaderPosition = 'inherit' | 'left' | 'center' | 'right' | 'justify';

const TableContainerWrapper = styled.div`
  & .MuiInputBase-root {
    display: none;
  }`;

type DataTableProps = {
  items: any[],
  currentPage: number,
  title?: string,
  perPage: number,
  headers: string[],
  isLoading?: boolean,
  noDataMessage?: string,
  hidePagination?: boolean,
  totalAmountOfItems: number,
  headersPositions?: HeaderPosition[],
  // eslint-disable-next-line no-unused-vars
  onChangePage?: (page: number) => void,
  // eslint-disable-next-line no-unused-vars
  onChangeRowsPerPage?: (perPage: any) => void,
};

const skeletons = [0, 1, 2, 3, 4];
const defaultPerPageOptions = [5, 10, 25, 50, 100];

const DataTable = (props: DataTableProps) => {
  const { headers, items, totalAmountOfItems, currentPage, isLoading,
    onChangePage, headersPositions, title, noDataMessage, hidePagination, perPage, onChangeRowsPerPage } = props;
  const classes = useStyles();

  const statusToolTipText = title === 'Operators' ?
      'Monitoring indication whether the operator is performing his network duties for the majority of his validators (per the last 2 epochs).' :
      'Refers to the validator’s status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties (according to the last 2 epochs).';

  const dataRows = () => {
    if (isLoading) {
      return skeletons.map((rowIndex: number) => (
        <StyledRow hover role="checkbox" tabIndex={-1} key={`row-${rowIndex}`}>
          {headers.map((header: string) => (
            <StyledCell key={`cell-${header}`}>
              <Skeleton />
            </StyledCell>
          ))}
        </StyledRow>
      ));
    }
    if (!items?.length) {
      return (
        <StyledRow hover role="checkbox" tabIndex={-1}>
          <StyledCell align="center" colSpan={headers?.length || 1}>
            {noDataMessage ?? 'No records'}
          </StyledCell>
        </StyledRow>
      );
    }
    return items.map((row: any[], rowIndex: number) => (
      <StyledRow hover role="checkbox" tabIndex={-1} key={`row-${rowIndex}`}>
        {row.map((cell: any, cellIndex: number) => (
          <StyledCell
            key={`cell-${cellIndex}`}
            align={headersPositions?.length ? headersPositions[cellIndex] : undefined}
          >
            {cell}
          </StyledCell>
        ))}
      </StyledRow>
    ));
  };

  return (
    <div className={classes.TableWithBorder}>
      <TableContainer>
        {title ? <Typography className={classes.TableHeader}>{title}</Typography> : ''}

        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headers.map((header: string, headerIndex: number) => (
                <TableCell
                  className={classes.TableCell}
                  key={header}
                  align={headersPositions?.length ? headersPositions[headerIndex] : undefined}
                >
                  {header}
                  { header === 'Status' && <ToolTip text={statusToolTipText} />}
                </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows()}
          </TableBody>
        </Table>

        {/* eslint-disable-next-line no-constant-condition */}
        {!hidePagination && false && items?.length ? (
          <TableContainerWrapper>
            <TablePagination
              page={currentPage}
              component="div"
              rowsPerPage={perPage}
              colSpan={headers.length}
              count={totalAmountOfItems}
              ActionsComponent={PaginationActions}
              rowsPerPageOptions={defaultPerPageOptions}
              onChangePage={(event: any, changedPage: number) => onChangePage ? onChangePage(changedPage) : null}
              onChangeRowsPerPage={(event: any) => onChangeRowsPerPage ? onChangeRowsPerPage(event.target.value) : null}
            />
          </TableContainerWrapper>
        ) : ''}
        <TableContainerWrapper>
          <PaginationActions
            page={currentPage}
            rowsPerPage={perPage}
            count={totalAmountOfItems}
            onChangePage={(event: any, changedPage: number) => onChangePage ? onChangePage(changedPage) : null}
          />
        </TableContainerWrapper>
      </TableContainer>
    </div>
  );
};

export default observer(DataTable);
