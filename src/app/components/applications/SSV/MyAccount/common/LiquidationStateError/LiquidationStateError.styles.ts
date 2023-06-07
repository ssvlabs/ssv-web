import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    ErrorTextWrapper: {
        gap: 10,
        borderRadius: 2,
        padding: '12px 16px',
        backgroundColor: 'rgba(236, 28, 38, 0.03)',
        border: `solid 1px ${theme.colors.primaryError}`,
    },
    ErrorText: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.black,
    },
    LinkText: {
        fontSize: 14,
        cursor: 'pointer',
        display: 'inline-block',
        overflowWrap: 'break-word',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
    OperatorChangeTextWrapper: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    OperatorChangeText: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
    },
    OperatorChangeTextDeposit: {

    },
}));
