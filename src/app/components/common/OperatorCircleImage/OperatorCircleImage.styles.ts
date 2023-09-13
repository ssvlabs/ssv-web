import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
    CircleImageOperator: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        alignItems: 'center',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: (props: any) => `url(${props?.operatorLogo || '/images/operator_default_background/circle_light.png'})`,
    },
}));
