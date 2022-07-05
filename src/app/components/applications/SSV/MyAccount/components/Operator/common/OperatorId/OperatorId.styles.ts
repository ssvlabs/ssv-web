import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        gap: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    OperatorId: {
        fontWeight: 500,
        fontSize: (props: any) => props.successPage ? 18 : 16,
        lineHeight: (props: any) => props.successPage ? 1.8 : 1.62,
        color: (props: any) => props.successPage ? theme.colors.gray100 : theme.colors.gray80,
    },
}));