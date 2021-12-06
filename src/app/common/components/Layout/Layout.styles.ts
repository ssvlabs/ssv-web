import screenSizes from '~lib/utils/screenSizes';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    '& *': {
    },
    '& input': {
      outline: 0,
      '&:focus': {
        border: '1px solid #A1ACBE',
      },
    },
    flexGrow: 1,
    // maxWidth: '540px',
    margin: 'auto',
    // maxWidth: '100%',
    // width: '30%',
    // margin: 'auto',
    '@media (max-width: 767px)': {
      width: '90%',
    },
    // '@media (max-width: 768px)': {
    //   width: '50%',
    // },
    // '@media (max-width: 480px)': {
    //   width: '90%',
    // },
  },
  dashboardRoot: {
    '& *': {
    },
    '& input': {
      outline: 0,
      '&:focus': {
        border: '1px solid #A1ACBE',
      },
    },
    flexGrow: 1,
    width: '95%',
    margin: 'auto',
    [screenSizes.lg]: {
      width: '728px',
    },
    maxWidth: '1200px',
  },
}));
