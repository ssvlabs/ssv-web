import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    '& input': {
      outline: 0,
      '&:focus': {
        border: '1px solid #A1ACBE',
      },
    },
  },
}));
