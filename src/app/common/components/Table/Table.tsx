import React from 'react';
// @ts-ignore
import { useTable } from 'react-table';
import { Grid } from '@material-ui/core';
import MaUTable from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import PaginationActions from '~app/common/components/Table/PaginationActions';
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

export const Table = ({ columns, data, hideActions = false, actionProps }: { columns: any, data: any, hideActions?: boolean, actionProps?: PaginationActionParams }) => {
    // console.log(actionProps?.onChangePage(5));
    const classes = useStyles({ hideActions });

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
          <MaUTable {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup: any) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    <TableCell {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </TableCell>
                            ))}
                </TableRow>
                    ))}
            </TableHead>
            <TableBody>
              {rows.map((row: any) => {
                        prepareRow(row);
                        return (
                          <TableRow {...row.getRowProps()}>
                            {row.cells.map((cell: any) => {
                                    return (
                                      <TableCell {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                      </TableCell>
                                    );
                                })}
                          </TableRow>
                        );
                    })}
            </TableBody>
          </MaUTable>
        </TableContainer>
        {!hideActions && actionProps && (
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
