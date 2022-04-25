import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Test: {
        // marginTop: 120,
    },
    OperatorsWrapper: {
        gap: 12,
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