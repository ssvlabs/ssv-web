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
    border: '2px solid #3f51b5',
    borderRadius: '0',
    backgroundColor: 'none',
    borderTop: 'none',
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
  verifiedWrapper: {
    alignItems: 'flex-end',
  },
  verifiedText: {
    float: 'right',
    alignItems: 'center',
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    fontWeight: 500,
    textAlign: 'center',
    padding: '4px',
    fontSize: '9px',
    color: '#5B6C84',
    backgroundColor: 'rgba(201, 254, 244, 0.35)',
    width: '65px',
    borderRadius: '3px',
  },
  verifiedIcon: {
    margin: 'auto',
    display: 'block',
    height: '13px',
    color: '#20EEC8',
  },
  chartIcon: {
    margin: 'auto',
    display: 'block',
    height: '24px',
  },
}));
