import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import IntegerInput from '~app/components/common/IntegerInput';
import { useStyles } from '~app/components/common/Table/PaginationActions/PaginationAction.styles';

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onChangeRowsPerPage?: any;
  // eslint-disable-next-line no-unused-vars
  onChangePage: (newPage: number) => void;
}

const PaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, totalPages, onChangePage } = props;
  const classes = useStyles({ firstPage: page === 1, lastPage: page === totalPages });
  const startAt = rowsPerPage * (page - 1) + 1;
  const [currentPage, setCurrentPage] = useState(page);
  const endAt = startAt + rowsPerPage - 1 > count ? count : startAt + rowsPerPage - 1;

  useEffect(() => {
    if (page !== currentPage) setCurrentPage(page);
  }, [page]);

  const handleBackButtonClick = () => {
    if (page === 1) return;
    if (page !== 1) onChangePage(page - 1);
  };
  const handleNextButtonClick = () => {
    if (page === totalPages) return;
    onChangePage(page + 1);
  };

  const handleSetPage = (event: any) => {
    let desiredPage = event.target.value.trim();
    if (desiredPage > totalPages) desiredPage = totalPages;
    if (desiredPage < 1) desiredPage = 1;
    setCurrentPage(desiredPage);
  };
  const changePageNumber = (event: any) => {
    const desiredPage = event.target.value.trim();
    if (Number(desiredPage) !== page) onChangePage(desiredPage);
  };

  return (
    <Grid container className={classes.Root}>
      <Grid container item xs={5}>
        <Typography className={classes.PageRangeText}>
          {startAt} - {endAt} of {count}
        </Typography>
      </Grid>
      <Grid container item xs className={classes.ButtonsWrapper}>
        <Grid item className={classes.LeftArrows} onClick={handleBackButtonClick}>
          <Grid className={classes.SingleLeft} />
        </Grid>
        <Grid item className={classes.PageNumber}>
          <IntegerInput type="number" value={currentPage} onChange={handleSetPage} onBlur={changePageNumber} className={classes.PageEditor} />
        </Grid>
        <Grid item>
          <Typography>of {totalPages} pages</Typography>
        </Grid>
        <Grid item className={classes.RightArrows} onClick={handleNextButtonClick}>
          <Grid className={classes.SingleRight} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PaginationActions;
