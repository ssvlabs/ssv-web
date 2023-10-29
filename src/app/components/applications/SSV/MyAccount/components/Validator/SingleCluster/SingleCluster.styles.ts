import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  Section: {
    gap: 24,
    width: 1320,
    marginTop: 32,
    margin: 'auto',
  },
  AddToCluster: {
    height: 36,
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 8,
    lineHeight: 1.25,
    transition: 'none',
    textTransform: 'unset',
    color: theme.colors.primaryBlue,
    fontFamily: 'Manrope !important',
    backgroundColor: theme.colors.tint90,
    '&:hover': {
      backgroundColor: theme.colors.tint80,
    },
    '&:active': {
      backgroundColor: theme.colors.tint70,
    },
    '&:disabled': {
      color: theme.colors.gray40,
      backgroundColor: theme.colors.gray20,
    },
  },
  HeaderWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Header: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1.4,
    color: theme.colors.gray40,
  },
}));