import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const text = {
  fontSize: 24,
  lineHeight: 1.24,
  letterSpacing: -0.25,
};
export const useStyles = makeStyles((theme: Theme) => ({
  HeaderText: {
    ...text,
    fontWeight: 800,
    color: theme.colors.gray90,
  },
  subHeaderText: {
    ...text,
    color: theme.colors.gray80,
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
}));