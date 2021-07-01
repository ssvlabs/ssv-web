import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    maxWidth: '100%',
    width: '30%',
    margin: 'auto',
    '@media (max-width: 1024px)': {
      width: '45%',
    },
    '@media (max-width: 768px)': {
      width: '50%',
    },
    '@media (max-width: 480px)': {
      width: '90%',
    },
  },
  gridWrapper: {
  },
}));
