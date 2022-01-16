import screenSizes from '~lib/utils/screenSizes';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    width: 648,
    flexGrow: 1,
    '& input': {
      outline: 0,
      '&:focus': {
        border: '1px solid #A1ACBE',
      },
    },
    margin: 'auto',
    [screenSizes.xs]: {
      width: '100%',
    },
    [screenSizes.md]: {
      width: 452,
    },
    [screenSizes.lg]: {
      width: 648,
    },
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
