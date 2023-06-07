import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    ContainerWrapper: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        flexDirection: 'row',
    },
    FeeValue: {
        fontSize: '20px',
        fontWeight: 800,
        margin: '0 10px 0 10px',
        color: theme.colors.black,
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
