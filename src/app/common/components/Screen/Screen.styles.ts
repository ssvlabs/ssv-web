import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    align: {
        textAlign: 'center',
    },
    navigation: {
        marginTop: '28px',
        [theme.breakpoints.up('lg')]: {
            marginTop: '54px',
        },
        marginBottom: '24px',
    },
    header: {
        marginBottom: '32px',
    },
    bottom: {
        position: 'absolute',
        bottom: '10%',
        width: '93%',
        [theme.breakpoints.up('sm')]: {
            width: '45%',
            bottom: '20%',
        },
        [theme.breakpoints.up('lg')]: {
            width: '25%',
            bottom: '20%',
        },
    },
}));
