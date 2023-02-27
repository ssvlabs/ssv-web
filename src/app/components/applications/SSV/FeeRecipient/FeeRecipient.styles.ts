import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Text: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray80,
  },
  Warning: {
    // width: 584px;
    gap: 10,
    height: 76,
    borderRadius: 2,
    padding: '12px 16px',
    border: `solid 1px ${theme.colors.warning}`,
    backgroundColor: theme.colors.primaryWarningRegular,
  },
  EditIcon: {
    width: 24,
    height: 24,
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(/images/search/${theme.darkMode ? 'dark' : 'light'}.svg)`,
  },
}));
