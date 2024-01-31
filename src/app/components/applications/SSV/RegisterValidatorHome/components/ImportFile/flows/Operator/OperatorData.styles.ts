import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  Wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',

  },
  OperatorLogo: {
    width: 32,
    height: 32,
    border: (props: any) => `1px solid ${props.hasError ? theme.colors.primaryError : theme.colors.gray20}`,
    borderRadius: '50%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: (props: any) => props.hasError && theme.colors.primaryErrorRegular,
    backgroundImage: (props: any) => `url(${props?.operatorLogo || '/images/operator_default_background/circle_light.png'})`,
  },
  OperatorId: {
    fontSize: 10,
    fontWeight: 500,
    color: (props: any) =>  props.hasError ? theme.colors.primaryError : theme.colors.gray40,
  },
  OperatorCardExtendClass: {
    left: -180,
  },
}));
