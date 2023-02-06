import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Test: {
        // marginTop: 120,
    },
    OperatorsWrapper: {
        gap: 12,
    },
    DialogWrapper: {
        width: 424,
        height: 318,
        borderRadius: 16,
        padding: '32px 32px 60px',
        backgroundColor: theme.colors.white,
    },
    Loader: {
        top: '68%',
        left: '50%',
        width: '100px',
        height: '100px',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
    },
    OperatorsDetails: {
        justifyContent: 'space-between',
    },
    networkFeeWrapper: {
        gap: 8,
    },
    NetworkYearlyFee: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: (props: any) => props.currentOperators ? theme.colors.gray80 : theme.colors.gray90,
    },
    SectionWrapper: {
        padding: '20px 32px 16px 32px',
        borderBottom: `solid 1px ${theme.colors.gray20}`,
        '&:nth-last-child(5)': {
            padding: 32,
        },
        '&:last-child': {
            border: 'none',
        },
    },
}));