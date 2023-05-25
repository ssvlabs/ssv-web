import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    NetworkToggleWrapper: {
        width: 125,
        height: 56,
        marginRight: 29,
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    NetworkIcon: {
        width: 24,
        height: 24,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: ({ networkId }: any) => networkId === 1 ? 'url(/images/networks/dark.svg)' : 'url(/images/networks/light.svg)',
    },
    NetworkLabel: {
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.25,
    },
    OptionsWrapper: {
        zIndex: 999,
        position: 'absolute',
    },
    Options: {
        right: -20,
        width: 240,
        display: 'flex',
        borderRadius: 8,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.white,
        boxShadow: '0 12px 40px 0 #0116271e',
        border: `solid 1px ${theme.colors.gray10}`,
    },
    Button: {
        gap: 12,
        padding: 16,
        flexGrow: 0,
        display: 'flex',
        cursor: 'pointer',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: `solid 1px ${theme.colors.gray20}`,
        '&:hover': {
            backgroundColor: theme.colors.gray10,
        },
        '& p': {
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.14,
            color: theme.colors.gray90,
        },
        '&:last-child': {
            borderBottom: 'none',
        },
    },
}));
