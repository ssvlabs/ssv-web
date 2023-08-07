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
  HeaderWrapper: {
    justifyContent: 'space-between',
  },
  Settings: {
    top: 36,
    width: 299,
    display: 'flex',
    borderRadius: 8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.white,
    boxShadow: '0 12px 40px 0 #0116271e',
    border: `solid 1px ${theme.colors.gray10}`,
    right: (props: any) => props.isOperator ? -155 : -67,
  },
  Header: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1.24,
    textAlign: 'left',
    letterSpacing: -0.25,
    color: theme.colors.gray90,
  },
  Arrow: {
    width: 32,
    height: 32,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/diagramArrow/light.svg)',
  },
  SettingsImageOperator: {
    backgroundImage: `url(/images/toggle_dashboard/operators-${theme.darkMode ? 'light' :  'dark'}.svg)`,
    ...imageDefaultProperties,
  },
  SettingsImageValidator: {
    backgroundImage: `url(/images/toggle_dashboard/validators-${theme.darkMode ? 'light' :  'dark'}.svg)`,
    ...imageDefaultProperties,
  },
  Button: {
    gap: 12,
    padding: 16,
    flexGrow: 0,
    fontSize: 14,
    display: 'flex',
    fontWeight: 600,
    lineHeight: 1.14,
    cursor: 'pointer',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.colors.gray90,
    justifyContent: 'flex-start',
    borderBottom: `solid 1px ${theme.colors.gray20}`,
    '&:hover': {
      backgroundColor: theme.colors.gray10,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  SettingsWrapper: {
    zIndex: 999,
    position: 'relative',
  },
}));
