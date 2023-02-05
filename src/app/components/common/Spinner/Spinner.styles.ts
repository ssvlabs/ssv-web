import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    SpinnerWrapper: {
        marginRight: 20,
        color: (props: any) => props.errorSpinner ? theme.colors.primaryError : theme.colors.tint20,
    },
}));