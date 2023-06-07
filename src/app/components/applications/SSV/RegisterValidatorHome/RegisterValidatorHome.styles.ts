import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
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
    width: 13.3,
    height: 13.7,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/v/green.svg)',
  },
  Text: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray80,
  },
}));
