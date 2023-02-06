import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Link: {
        fontSize: 16,
        cursor: 'pointer',
        display: 'inline-block',
        overflowWrap: 'break-word',
        color: theme.colors.primaryBlue,
        textDecoration: (props: any) => props.withoutUnderline ? '' : 'underline',
    },
}));
