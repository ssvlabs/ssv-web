import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  BackgroundImage: {
    top: -60,
    right: -65,
    width: 226,
    height: 345,
    position: 'absolute',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/backgroundIcon/light.svg)',
  },
  GrayText: {
    fontSize: 16,
    lineHeight: 1.62,
    marginBottom: 16,
    fontWeight: 'bold',
    color: theme.colors.gray40,
  },
  Gray90Text: {
    fontWeight: 500,
    marginBottom: 0,
    color: theme.colors.gray90,
  },
  GreenV: {
    width: 9,
    height: 6,
    border: 'solid 1.6px #08c858',
  },
  Text: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: '#34455a',
  },
}));
