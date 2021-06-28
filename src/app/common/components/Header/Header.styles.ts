import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  headerWrapper: {
    paddingBottom: theme.spacing(1),
  },
  centralized: {
    textAlign: 'center',
  },
  header: {
    letterSpacing: '0px',
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    fontWeight: 900,
    fontSize: '24px',
    color: '#21D7B5',
    marginBottom: '12px',
  },
  subHeader: {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    color: '#5B6C84',
  },
}));
