import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        borderRadius: 16,
        backgroundColor: theme.colors.white,
    },
    Header: {
        height: 28,
        fontSize: 20,
        lineHeight: 1.4,
        textAlign: 'left',
        fontWeight: 'bold',
        fontFamily: 'Manrope',
        margin: '32px 32px 0',
        color: theme.colors.gray40,
    },
    Row: {
        height: 36,
        padding: '32px 8px 0',
    },
}));