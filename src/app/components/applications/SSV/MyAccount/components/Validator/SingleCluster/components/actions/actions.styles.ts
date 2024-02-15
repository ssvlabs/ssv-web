import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  SettingsWrapper: {
    zIndex: 999,
    position: 'absolute',
  },
  Settings: {
    right: -20,
    width: 240,
    display: 'flex',
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.white,
    boxShadow: '0 12px 40px 0 #0116271e',
    border: `solid 1px ${theme.colors.gray10}`,
  },
  Button: {
    gap: 12,
    padding: 16,
    flexGrow: 0,
    display: 'flex',
    cursor: 'pointer',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottom: `solid 1px ${theme.colors.gray20}`,
    '&:hover': {
      backgroundColor: theme.colors.gray10,
    },
    '& p': {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.14,
      color: theme.colors.gray90,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
}));
