import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  GridItem: {
    height: 74
  },
  TextError: {
    color: 'red !important',
    zIndex: 9123123,
    fontSize: '0.8rem',
    '& p': {
      zIndex: 9123123,
      cursor: 'pointer',
      fontSize: '0.8rem',
      color: 'red !important'
    }
  },
  WarningMessage: {
    gap: 8,
    fontSize: 14,
    borderRadius: 2,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray90,
    padding: theme.spacing(3, 4),
    marginBottom: 35,
    backgroundColor: 'rgba(255, 210, 10, 0.2)',
    border: `solid 1px ${theme.colors.warning}`,
    justifyContent: 'space-between'
  }
}));
