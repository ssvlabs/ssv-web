import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    PopUpWrapper: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 15,
        height: 'auto',
        width: 'auto',
        minWidth: 230,
        borderRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        padding: '16px 24px',
        backgroundColor: theme.colors.white,
        boxShadow: '0 3px 12px 0 rgba(0, 0, 0, 0.06)',
        zIndex: 99999999,
        top: 15,
        right: 10,
    },
    MevRelayCardText: {
        color: theme.colors.black,
    },
    FullImage: {
        width: 40,
        height: 40,
        alignItems: 'center',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: (props: any) => `url(/images/mevs/${props.mevRelayLogo}.svg)`,
    },
    Line: {
        width: 1,
        height: 56,
        transform: 'rotate(-180deg)',
        backgroundColor: theme.colors.gray20,
    },
}));
