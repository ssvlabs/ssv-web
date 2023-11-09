import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
    ImageWrapper: {
        width: 256,
        height: 220,
        margin: 'auto',
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/restrict/restrict.svg)',
    },
}));
