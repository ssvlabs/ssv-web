import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    SpinnerWrapper: {
        marginRight: 20,
        color: (props: any) => props.errorSpinner ? theme.colors.primaryError : theme.colors.tint20,
    },
}));