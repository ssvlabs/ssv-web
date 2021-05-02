import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  formControl: {
    margin: theme.spacing(0),
    marginTop: theme.spacing(1),
    width: '100%',
    maxWidth: '100%',
  },
  select: {
    '& .MuiSelect-outlined': {
      paddingTop: 5,
      paddingBottom: 5,
      minHeight: 55,
    },
  },
  selectPaper: {
    maxWidth: 300,
    '& ul': {
      padding: 3,
      maxHeight: 400,
    },
    '& li': {
      width: 'inherit',
    },
  },
  menuItem: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'start',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));
