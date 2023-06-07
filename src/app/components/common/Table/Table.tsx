import React from 'react';
// @ts-ignore
import { useTable } from 'react-table';
import Grid from '@mui/material/Grid';
import TTable from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import PaginationActions from '~app/components/common/Table/PaginationActions';
import { useStyles } from './Table.styles';

type PaginationActionParams = {
    type: string;
    perPage: number;
    onChangePage: any;
    totalPages: number;
    currentPage: number;
    onChangeRowsPerPage: any;
    totalAmountOfItems: number;
};

export const Table = ({ columns, data, disable, hideActions = false, actionProps }: { columns: any, data: any, disable?: boolean, hideActions?: boolean, actionProps?: PaginationActionParams }) => {
    // console.log(actionProps?.onChangePage(5));
    const classes = useStyles({ disable, hideActions });

    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
    );

    // Render the UI for your table
    return (
      <Grid container className={classes.TableWrapper}>
        <TableContainer className={classes.CustomizeCss}>
          <TTable {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup: any, headerGroupIndex: number) => (
                <TableRow key={headerGroupIndex} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any, index: number) => (
                    <TableCell key={index}
                      style={{ width: index === 0 ? '30%' : 'auto' }} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {rows.map((row: any, index: number) => {
                        prepareRow(row);
                        return (
                          <TableRow key={index} {...row.getRowProps()}>
                            {row.cells.map((cell: any, rowIndex: number) => {
                                    return (
                                      <TableCell key={rowIndex} {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                      </TableCell>
                                    );
                                })}
                          </TableRow>
                        );
                    })}
            </TableBody>
          </TTable>
        </TableContainer>
        {!hideActions && actionProps && actionProps.totalPages > 1 && (
          <PaginationActions
            page={actionProps.currentPage ?? 0}
            rowsPerPage={actionProps.perPage ?? 0}
            totalPages={actionProps.totalPages ?? 0}
            count={actionProps.totalAmountOfItems}
            onChangePage={(changedPage: number) => actionProps.onChangePage ? actionProps.onChangePage({ type: actionProps.type, paginationPage: changedPage }) : null}
            onChangeRowsPerPage={(rowNumber: number) => actionProps.onChangeRowsPerPage ? actionProps.onChangeRowsPerPage(actionProps.type, rowNumber) : null}
          />
        )}
      </Grid>
    );
};
