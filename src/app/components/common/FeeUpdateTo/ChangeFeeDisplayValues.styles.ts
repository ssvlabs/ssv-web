import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
    ContainerWrapper: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        flexDirection: 'row',
    },
    FeeValue: {
        fontSize: '20px',
        fontWeight: 800,
        color: '#0b2a3c',
        margin: '0 10px 0 10px',
    },
    ArrowImage: {
        width: '20px',
        height: '20px',
        backgroundSize: 'contain',
        transform: 'scaleX(-1)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage:(props: any) => props.negativeArrow ? 'url(/images/arrow/light_red.svg)' : 'url(/images/backButton/light.svg)',
    },
}));
