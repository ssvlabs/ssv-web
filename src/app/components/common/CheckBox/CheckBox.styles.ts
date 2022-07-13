import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    CheckBoxWrapper: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        alignItems: 'flex-end',
        color: theme.colors.gray80,
        marginBottom: theme.spacing(5),
    },
    BoxWrapper: {
        borderRadius: 2,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        alignSelf: (props: any) => props.align ?? '',
        width: (props: any) => props.width ? props.width : 18,
        height: (props: any) => props.height ? props.height : 18,
        marginRight: (props: any) => props.marginRight ?? theme.spacing(4),
        backgroundColor: (props: any) => {
            if (props.grayBackGround && !props.checked) return theme.colors.gray10;
            if (props.checked) return theme.colors.primaryBlue;
            return 'transparent';
        },
        border: (props: any) => {
            if (props.grayBackGround && !props.checked) return `1px solid ${theme.colors.gray40}`;
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
