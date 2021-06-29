import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  inputAddonContainer: {
    backgroundColor: '#FAFAFA',
    borderLeft: '1px solid rgba(215, 215, 215, 1)',
    width: 40,
    minHeight: 40,
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
    width: 30,
    height: 30,
    margin: 'auto',
  },
  wideWidthInput: {
    width: '100%',
    padding: 0,
    height: 40,
  },
  input: {
    width: 'calc(86% - 3px)',
    paddingLeft: '10px',
    [theme.breakpoints.down('lg')]: {
      width: 'calc(86% - 10px)',
    },
  },
}));
