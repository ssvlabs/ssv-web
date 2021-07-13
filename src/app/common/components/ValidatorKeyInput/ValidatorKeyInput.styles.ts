import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  inputAddonContainer: {
    borderLeft: '1px solid gainsboro',
    width: 40,
    minHeight: '48px',
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    cursor: 'pointer',
  },
  inputAddonImage: {
    width: 23,
    height: 23,
    margin: 'auto',
  },
  wideWidthInput: {
    width: '100%',
    padding: 0,
    height: '48px',
    borderRadius: '6px',
  },
  input: {
    width: 'calc(86% - 3px)',
    fontSize: '14px',
    paddingLeft: '10px',
    [theme.breakpoints.down('lg')]: {
      width: 'calc(86% - 13px)',
    },
  },
}));
