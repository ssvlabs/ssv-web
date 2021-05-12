import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  inputAddonContainer: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
    borderLeft: '1px solid rgba(215, 215, 215, 1)',
    width: 45,
    minHeight: 45,
    position: 'absolute',
    right: 0,
    top: 0,
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
    height: 45,
  },
}));
