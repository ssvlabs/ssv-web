import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    gap: 10,
    width: '100%',
    borderRadius: 2,
    fontSize: 14,
    padding: '12px 16px',
    alignItems: 'center',
    color: theme.colors.black,
    justifyContent: 'flex-start',
    border: `solid 1px ${theme.colors.primaryError}`,
    backgroundColor: theme.colors.primaryErrorRegular
  }
}));
