import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    LightGrey: {
        color: theme.colors.gray40,
        fontWeight: (props: any) => props.weight || 'default',
        fontSize: (props: any) => props.size ? `${props.size}px` : '16px',
    },
}));