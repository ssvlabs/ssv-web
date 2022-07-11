import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    CheckBoxWrapper: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        alignItems: 'center',
        color: theme.colors.gray80,
        marginBottom: theme.spacing(5),
    },
    BoxWrapper: {
        borderRadius: 2,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginRight: theme.spacing(4),
        width: (props: any) => props.width ? props.width : 18,
        height: (props: any) => props.height ? props.height : 18,
        backgroundColor: (props: any) => {
            if (props.grayBackGround && !props.checked) return theme.colors.gray10;
            if (props.checked) return theme.colors.primaryBlue;
            return 'transparent';
        },
        border: (props: any) => {
            if (props.grayBackGround && !theme.darkMode) return `1px solid ${theme.colors.gray40}`;
            if (props.checked) return 'none';
            return '1px solid #5b6c84';
        },
        backgroundImage: (props: any) => {
            if (props.checked) return 'url(/images/v/light.svg)';
            return 'none';
        },
    },
    Text: {
        maxWidth: 543,
    },
}));
