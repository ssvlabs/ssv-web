import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Skeleton } from '@material-ui/lab';
import Table from '@material-ui/core/Table';
import { TableCell } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import NewToolTip from '~app/common/components/ToolTip';
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
  title?: string,
  headers: string[],
  headersPositions?: HeaderPosition[],
  data: any[],
  totalCount: number,
  page: number,
  isLoading?: boolean,
  // eslint-disable-next-line no-unused-vars
  onChangePage?: (page: number) => void,
  // eslint-disable-next-line no-unused-vars
  onChangeRowsPerPage?: (perPage: any) => void,
  // eslint-disable-next-line no-unused-vars
  noDataMessage?: string,
  perPage: number,
  hidePagination?: boolean,
};

const skeletons = [0, 1, 2, 3, 4];
const defaultPerPageOptions = [5, 10, 25, 50, 100];

const DataTable = (props: DataTableProps) => {
  const { headers, data, totalCount, page, isLoading,
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
    if (!data?.length) {
      return (
        <StyledRow hover role="checkbox" tabIndex={-1}>
          <StyledCell align="center" colSpan={headers?.length || 1}>
            {noDataMessage ?? 'No records'}
          </StyledCell>
        </StyledRow>
      );
    }
    return data.map((row: any[], rowIndex: number) => (
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
    <div className={classes.tableWithBorder}>
      <TableContainer>
        {title ? <h3>{title}</h3> : ''}

        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className={classes.TableRow}>
              {headers.map((header: string, headerIndex: number) => (
                <TableCell
                  className={classes.TableCell}
                  key={header}
                  align={headersPositions?.length ? headersPositions[headerIndex] : undefined}
                >
                  {header}
                  { header === 'STATUS' && <NewToolTip text={statusToolTipText} />}
                </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows()}
          </TableBody>
        </Table>

        {!hidePagination && false && data?.length ? (
          <TableContainerWrapper>
            <TablePagination
              page={page}
              component="div"
              count={totalCount}
              rowsPerPage={perPage}
              colSpan={headers.length}
              ActionsComponent={PaginationActions}
              rowsPerPageOptions={defaultPerPageOptions}
              onChangePage={(event: any, changedPage: number) => onChangePage ? onChangePage(changedPage) : null}
              onChangeRowsPerPage={(event: any) => onChangeRowsPerPage ? onChangeRowsPerPage(event.target.value) : null}
            />
          </TableContainerWrapper>
        ) : ''}
        <TableContainerWrapper>
          <PaginationActions
            page={page}
            onChangePage={(event: any, changedPage: number) => onChangePage ? onChangePage(changedPage) : null}
            count={totalCount}
            rowsPerPage={perPage}
          />
        </TableContainerWrapper>
      </TableContainer>
    </div>
  );
};

export default observer(DataTable);
