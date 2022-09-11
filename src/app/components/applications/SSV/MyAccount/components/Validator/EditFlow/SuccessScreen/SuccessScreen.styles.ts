import { makeStyles } from '@material-ui/core/styles';

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
export const useStyles = makeStyles((theme) => ({
  Wrapper: {
    gap: 32,
    position: 'relative',
    marginTop: theme.spacing(3),
  },
  BackgroundImage: {
    top: -90,
    right: -70,
    width: 266,
    height: 314,
    position: 'absolute',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/backgroundIcon/light.svg)',
  },
  SectionWrapper: {
    padding: theme.spacing(3, 8, 8, 8),
  },
  Text: {
    zIndex: 9,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.62,
    color: theme.colors.gray80,
  },
}));
