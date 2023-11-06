import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    SideButton: {
        padding: '4px 8px 4px 8px',
        fontSize: 16,
        fontWeight: 600,
        color: theme.colors.gray90,
        borderRadius: 8,
        backgroundColor:(props: any) => props.confirmedState ? '#1fcf98' : theme.colors.gray20,
        cursor: 'pointer',
        position: 'relative',
        bottom: 5,
    },
    Disable: {
        color: theme.colors.gray40,
        cursor: 'default',
    },
}));