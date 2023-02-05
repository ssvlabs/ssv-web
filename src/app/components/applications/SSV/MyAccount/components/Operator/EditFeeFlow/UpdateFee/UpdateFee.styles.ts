import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    HeaderWrapper: {
        gap: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    Address: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    InputText: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
    },
    BodyWrapper: {
        marginTop: 24,
        margin: 'auto',
        marginBottom: 120,
    },
    BulletsWrapper: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray60,
        '& li': {
            // marginBottom: 8,
        },
        '& ul': {
            margin: 0,
            paddingLeft: 16,
        },
    },
    Notice: {
        gap: 10,
        marginTop: 40,
        borderRadius: 2,
        display: 'flex',
        marginBottom: 24,
        padding: '12px 16px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.primaryWarningRegular,
        border: `solid 1px ${theme.colors.primaryWarningRegular}`,
    },
    TechnicalImage: {
        width: 33,
        height: 33,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: (props: any) => `url(/images/setting/${props.leavingReason === 1 ? 'selected' : 'blue'}.svg)`,
    },
    ProfitabilityImage: {
        width: 33,
        height: 33,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: (props: any) => `url(/images/profitability/${props.leavingReason === 2 ? 'selected' : 'light'}.svg)`,
    },
    OtherImage: {
        width: 33,
        height: 33,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: (props: any) => `url(/images/other/${props.leavingReason === 3 ? 'selected' : 'light'}.svg)`,
    },
    ShareWithUsWrapper: {
        width: 584,
        borderRadius: 8,
        marginBottom: 24,
        padding: '20px 24px 24px 16px',
        backgroundColor: theme.colors.gray10,
        height: (props: any) => {
            if (props.leavingReason === 1) {
                return 188;
            }
            if (props.leavingReason === 2) {
                return 211;
            }
            return 122;
        },
    },
    Title: {
        fontSize: 20,
        lineHeight: 1.4,
        fontWeight: 'bold',
        color: theme.colors.gray70,
    },
    Step: {
        gap: 10,
        width: 89,
        height: 26,
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 4,
        display: 'flex',
        lineHeight: 1.62,
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.primaryBlue,
        backgroundColor: theme.colors.tint90,
    },
    TextWrapper: {
        gap: 12,
        marginBottom: 40,
    },
    InputWrapper: {
        gap: 8,
        justifyContent: 'space-between',
    },
    ShareWithUsBulletsPoints: {
        fontSize: 14,
        fontWeight: 500,
        marginBottom: 24,
        lineHeight: 1.62,
        color: theme.colors.gray90,
        '& p': {
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.62,
        },
        '& ul': {
            margin: 0,
            paddingLeft: 20,
            '& li::marker': {
                fontSize: 10,
            },
        },
    },
}));