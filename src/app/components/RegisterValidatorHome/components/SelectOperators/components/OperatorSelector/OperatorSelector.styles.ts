import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  selectButton: {
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'Encode Sans',
    color: '#2A323E',
    margin: theme.spacing(0),
    marginTop: theme.spacing(1),
    width: '100%',
    maxWidth: '100%',
    height: '50px',
    padding: '6px 18px 6px 18px',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    border: '1px solid #5B6C84',
    cursor: 'pointer',
  },
  buttonArrow: {
    height: '20%',
    float: 'right',
    marginRight: '10px',
    marginTop: '5px',
    transitionDuration: '0.3s',
    transform: 'rotate(180deg)',
  },
  arrowSelected: {
    transform: 'rotate(0deg)',
    transitionDuration: '0.3s',
  },
  selected: {
    borderRadius: '6px 6px 0px 0px',
    borderBottom: 'none',
  },
  menuLoader: {
    textAlign: 'center',
  },
  menuWrapper: {
    width: '30%',
    '@media (max-width: 1025)': {
      width: '75%',
    },
    '@media (max-width: 768px)': {
      width: '50%',
    },
    '@media (max-width: 480px)': {
      width: '90%',
    },
    position: 'absolute',
    zIndex: 1,
    border: '1px solid #5B6C84',
    borderTop: 'none',
    background: '#FFFFFF',
    borderRadius: '0px 0px 6px 6px',
    height: '362px',
    overflow: 'scroll',
  },
  menuItem: {
    height: '62px',
    padding: '18px',
    display: 'flex',
    flexGrow: 1,
    alignItems: 'start',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  disable: {
    backgroundColor: '#F5F6F8',
  },
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
    shadow: '0px',
    border: '2px solid #3f51b5',
    boxShadow: 'none',
    borderRadius: '0',
    borderTop: 'none',
    marginTop: '43px',
    '& ul': {
      padding: 3,
      '@media (max-width: 480px)': {
        maxHeight: '200px',
        minWidth: '327px',
      },
      maxHeight: 362,
    },
    '& li': {
      width: 'inherit',
    },
  },
  verifiedWrapper: {
    alignItems: 'flex-end',
  },
  verifiedText: {
    float: 'right',
    alignItems: 'center',
    fontFamily: 'Encode Sans',
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
