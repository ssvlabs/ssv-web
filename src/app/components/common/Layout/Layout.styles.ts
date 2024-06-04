import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
  Root: {
    '& input': {
      outline: 0
      // '&:focus': {
      //   border: '1px solid #A1ACBE',
      // },
    }
  }
}));
