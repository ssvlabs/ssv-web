import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        width: 648,
        height: 245,
        marginTop: 24,
        margin: 'auto',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        padding: '37px 32px 32px',
        backgroundColor: theme.colors.white,
    },
    BackgroundImage: {
        top: -30,
        right: -25,
        width: 200,
        height: 345,
        position: 'absolute',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/backgroundIcon/light.svg)',
    },
    Header: {
        fontSize: 20,
        lineHeight: 1.4,
        marginBottom: 24,
        fontWeight: 'bold',
        color: theme.colors.gray90,
    },
    SubHeader: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 40,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    BodyWrapper: {
        marginTop: 24,
        margin: 'auto',
    },
    BulletsWrapper: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.8,
        color: theme.colors.gray80,
        '& li': {
            marginBottom: 8,
            '&:last-child': {
                marginBottom: 0,
            },
        },
    },
    Notice: {
        gap: 10,
        height: 70,
        marginTop: 16,
        borderRadius: 2,
        display: 'flex',
        marginBottom: 32,
        padding: '12px 16px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.primaryWarningRegular,
        border: `solid 1px ${theme.colors.primaryWarningRegular}`,
    },
    TextHelper: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.8,
        marginBottom: 24,
        color: theme.colors.gray80,
    },
    BoxesWrapper: {
        gap: 23,
        marginBottom: 23,
    },
    BoxWrapper: {
        gap: 12,
        width: 179,
        height: 104,
        fontSize: 16,
        fontWeight: 500,
        borderRadius: 6,
        lineHeight: 1.62,
        cursor: 'pointer',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        color: theme.colors.primaryBlue,
        backgroundColor: theme.colors.white,
        border: `solid 1px ${theme.colors.primaryBlue}`,
        '&:nth-child(1)': {
            backgroundColor: (props: any) => props.leavingReason === 1 ? theme.colors.primaryBlue : theme.colors.white,
            color: (props: any) => props.leavingReason === 1 ? theme.colors.white : theme.colors.primaryBlue,
        },
        '&:nth-child(2)': {
            backgroundColor: (props: any) => props.leavingReason === 2 ? theme.colors.primaryBlue : theme.colors.white,
            color: (props: any) => props.leavingReason === 2 ? theme.colors.white : theme.colors.primaryBlue,
        },
        '&:nth-child(3)': {
            backgroundColor: (props: any) => props.leavingReason === 3 ? theme.colors.primaryBlue : theme.colors.white,
            color: (props: any) => props.leavingReason === 3 ? theme.colors.white : theme.colors.primaryBlue,
        },
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
    InputWrapper: {
        width: 536,
        height: 74,
        fontSize: 16,
        borderRadius: 4,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray40,
        padding: '24px 277px 9px 23px',
        backgroundColor: theme.colors.white,
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