import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const imageDefaultProperties = {
  width: 16,
  height: 16,
  cursor: 'pointer',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

export const useStyles = makeStyles((theme: Theme) => ({
  Section: {
    gap: 24,
    width: 1320,
    marginTop: 32,
    margin: 'auto',
  },
  SettingsWrapper: {
    zIndex: 999,
    position: 'absolute',
  },
  Settings: {
    right: -20,
    width: 240,
    display: 'flex',
    borderRadius: 8,
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
  ChangeOperatorsImage: {
    backgroundImage: `url(/images/validator_settings/${theme.darkMode ? 'dark_' : ''}change.svg)`,
    ...imageDefaultProperties,
  },
  RemoveValidatorImage: {
    backgroundImage: `url(/images/validator_settings/${theme.darkMode ? 'dark_' : ''}remove.svg)`,
    ...imageDefaultProperties,
  },
  ChangeOperatorsLinkImage: {
    backgroundImage: `url(/images/validator_settings/${theme.darkMode ? 'dark_' : ''}link.svg)`,
    ...imageDefaultProperties,
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
  ExtraButtonsWrapper: {
    gap: 8,
    position: 'relative',
    justifyContent: 'end',
    padding: '14px 26px 20px 32px',
  },
  Header: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1.4,
    color: theme.colors.gray40,
  },
}));