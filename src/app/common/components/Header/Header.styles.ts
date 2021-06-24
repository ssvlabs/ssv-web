import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  headerWrapper: {
    paddingBottom: theme.spacing(1),
  },
  centralized: {
    textAlign: 'center',
  },
  header: {
    fontFamily: 'Encode Sans',
    fontStyle: 'normal',
    fontWeight: 900,
    fontSize: '28px',
    color: '#20EEC8',
    marginBottom: '12px',
  },
  subHeader: {
    fontFamily: 'Encode Sans',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    color: '#5B6C84',
  },
}));
