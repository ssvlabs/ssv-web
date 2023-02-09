import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const imageDefaultProperties = {
  width: 24,
  height: 24,
  cursor: 'pointer',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

export const useStyles = makeStyles((theme: Theme) => ({
  Settings: {
    right: 0,
    width: 272,
    display: 'flex',
    borderRadius: 8,
    position: 'absolute',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.white,
    boxShadow: '0 12px 40px 0 #0116271e',
    border: `solid 1px ${theme.colors.gray10}`,
  },
  Button: {
    gap: 12,
    height: 54,
    padding: 16,
    flexGrow: 0,
    fontSize: 16,
    display: 'flex',
    fontWeight: 600,
    lineHeight: 1.25,
    cursor: 'pointer',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottom: `solid 1px ${theme.colors.gray20}`,
    '&:hover': {
      backgroundColor: theme.colors.gray10,
    },
    '& p': {
      color: theme.colors.gray90,
    },
    '&:last-child': {
      '& p': {
        color: theme.colors.primaryError,
      },
      borderBottom: 'none',
    },
  },
  SettingsImage: {
    backgroundImage: 'url(/images/operator_settings/settings.svg)',
    ...imageDefaultProperties,
  },
  MetadataImage: {
    backgroundImage: 'url(/images/operator_settings/metadata.svg)',
    ...imageDefaultProperties,
  },
  RemoveImage: {
    backgroundImage: 'url(/images/operator_settings/metadata.svg)',
    ...imageDefaultProperties,
  },
  BackNavigation: {
    width: 14,
    height: 14,
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/backButton/light.svg)',
  },
  HeaderText: {
    fontSize: 24,
    marginLeft: 16,
    fontWeight: 800,
    lineHeight: 1.24,
    textAlign: 'left',
    letterSpacing: -0.25,
    color: theme.colors.gray90,
  },
  CompleteProfile: {
    gap: 4,
    height: 34,
    fontSize: 16,
    marginLeft: 23,
    display: 'flex',
    borderRadius: 8,
    fontWeight: 500,
    lineHeight: 1.62,
    padding: '4px 8px',
    alignItems: 'center',
    color: theme.colors.gray90,
    backgroundColor: 'rgba(253, 218, 72, 0.2)',
  },
  Options: {
    width: 40,
    height: 40,
    float: 'right',
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(/images/kebab/${theme.darkMode ? 'dark' : 'light'}.svg)`,
  },
  SettingsWrapper: {
    position: 'relative',
  },
}));