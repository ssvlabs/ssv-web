import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  OperatorLogo: {
    width: 32,
    height: 32,
    border: `1px solid ${theme.colors.gray20}`,
    borderRadius: '50%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: (props: any) => `url(${props?.operatorLogo || '/images/operator_default_background/circle_light.png'})`,
  },
  OperatorId: {
    fontSize: 10,
    fontWeight: 500,
    color: theme.colors.gray40,
  },
}));
