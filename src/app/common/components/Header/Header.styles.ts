import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  centralized: {
    textAlign: 'center',
  },
  header: {
    letterSpacing: '0px',
    fontFamily: 'Encode Sans',
    fontStyle: 'normal',
    fontWeight: 900,
    fontSize: '28px',
    color: '#20EEC8',
    '@media (max-width: 480px)': {
      fontSize: '24px',
    },
  },
  subHeader: {
    fontFamily: 'Encode Sans',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    color: '#5B6C84',
  },
}));
