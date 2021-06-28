import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
    },
    icon: {
        display: 'block',
        margin: 'auto',
        width: '80px',
    },
    align: {
        textAlign: 'center',
    },
    navigation: {
        marginTop: '28px',
        [theme.breakpoints.up('lg')]: {
            marginTop: '54px',
        },
        // height: '40px',
        marginBottom: '24px',
    },
    header: {
        // maxHeight: '200px',
        marginBottom: '32px',
    },
    body: {
        // maxHeight: '300px',
        [theme.breakpoints.up('lg')]: {
            // minHeight: '210px',
        },
    },
    bottom: {
        position: 'absolute',
        bottom: '10%',
        width: '93%',
        // marginTop: '90px',
        [theme.breakpoints.up('lg')]: {
            width: '25%',
            bottom: '20%',
        },
    },
}));
