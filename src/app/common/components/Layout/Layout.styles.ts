import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    fontFamily: 'Encode Sans',
    '& *': {
      fontFamily: 'Encode Sans',
    },
    '& input': {
      outline: 0,
      '&:focus': {
        border: '1px solid #A1ACBE',
      },
    },
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
}));
