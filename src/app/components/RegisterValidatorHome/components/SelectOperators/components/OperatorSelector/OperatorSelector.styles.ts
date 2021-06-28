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
      minHeight: 35,
    },
  },
  selectPaper: {
    maxWidth: 300,
    '& ul': {
      padding: 3,
      maxHeight: 300,
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
  verifiedText: {
    padding: '2px',
    display: 'flex',
    fontSize: '10px',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    border: '1px solid #F2F2F2',
    borderRadius: '20px 20px 20px 20px',
  },
  verifiedIcon: {
    height: '18px',
    color: 'blue',
  },
}));
