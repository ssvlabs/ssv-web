import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    CheckBoxWrapper: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        // alignItems: 'center',
        color: theme.colors.gray80,
        marginBottom: theme.spacing(5),
    },
    BoxWrapper: {
        width: 24,
        height: 24,
        borderRadius: 2,
        marginRight: theme.spacing(4),
        border: (props: any) => props.grayBackGround ? `1px solid ${theme.colors.gray40}` : '1px solid #5b6c84',
        backgroundColor: (props: any) => props.grayBackGround ? theme.colors.gray10 : 'transparent',
    },
    Checked: {
        width: 24,
        height: 24,
        border: 'none',
        backgroundImage: `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    Text: {
        maxWidth: 543,
    },
}));
