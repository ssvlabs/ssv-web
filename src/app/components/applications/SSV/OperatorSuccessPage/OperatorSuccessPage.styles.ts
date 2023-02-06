import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  GreyHeader: {
    fontSize: 16,
    marginTop: 4,
    lineHeight: 1.62,
    marginBottom: 16,
    fontWeight: 'bold',
    color: theme.colors.gray40,
  },
  Wrapper: {
    position: 'relative',
  },
  BoxesWrapper: {
    gap: 20,
  },
  BoxWrapper: {
    gap: 8,
    minHeight: 84,
    padding: 16,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    borderRadius: 8,
    backgroundColor: '#f8fcff',
    color: theme.colors.gray80,
    border: `solid 1px ${theme.colors.gray20}`,
  },
  BackgroundImage: {
    top: -120,
    zIndex: 0,
    width: 120,
    height: 347,
    right: -34,
    position: 'absolute',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/backgroundIcon/light.svg)',
  },
  Text: {
    zIndex: 1,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray80,
  },
  LightText: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.14,
    color: theme.colors.gray40,
  },
}));
