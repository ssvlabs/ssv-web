import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Link: {
        cursor: 'pointer',
        display: 'inline-block',
        overflowWrap: 'break-word',
        color: theme.colors.primaryBlue,
        textDecoration: (props: any) => props.withoutUnderline ? '' : 'underline',
    },
}));
