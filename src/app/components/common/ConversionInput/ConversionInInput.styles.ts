import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    FeeInput: {
        marginTop: '0px',
    },
    Conversion: {
        width: 88,
        height: 28,
        padding: 2,
        float: 'right',
        borderRadius: 8,
        border: `solid 1px ${theme.colors.gray20}`,
        backgroundColor: theme.colors.gray10,
    },
    Currency: {
        width: 40,
        height: 22,
        fontSize: 12,
        borderRadius: 5,
        fontWeight: 500,
        cursor: 'pointer',
        padding: '2px 8px 1px 9px',
        color: theme.colors.gray40,
    },
    SelectedCurrency: {
        backgroundColor: theme.colors.gray60,
        color: theme.colors.gray10,
    },
    InputAdditionalDataWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    AnnualFeeLabel: {
        size: '14px',
        color: `${theme.colors.gray40}`,
    },
    TextError: {
        color: 'red',
        zIndex: 9123123,
        fontSize: '14px',
        width: '23px',
    },
    TextErrorWrapper: {
        height: '23px',
        whiteSpace: 'nowrap',
    },
}));
