import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  inputAddonContainer: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
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
}));
