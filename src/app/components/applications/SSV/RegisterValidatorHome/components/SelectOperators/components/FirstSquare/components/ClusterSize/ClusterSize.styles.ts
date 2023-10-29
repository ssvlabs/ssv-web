import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    ClusterSizeWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    Title: {
        fontSize: 16,
        fontWeight: 700,
        color: theme.colors.gray40,
    },
    ClusterSizeButton: {
        width: 166,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${theme.colors.gray20}`,
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 800,
        color: theme.colors.gray40,
        cursor: 'pointer',
    },
    ChosenClusterSize: {
        color: theme.colors.primaryBlue,
        borderColor: theme.colors.tint70,
        backgroundColor: theme.colors.tint90,
    },
}));
