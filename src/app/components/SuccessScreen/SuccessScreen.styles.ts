import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    SectionWrapper: {
        padding: theme.spacing(3, 8, 8, 8),
    },
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    Header: {},
    SubHeader: {
        marginBottom: theme.spacing(3),
    },
    CtaWrapper: {
        marginBottom: 0,
    },
    SubImageText: {
        marginBottom: theme.spacing(10),
    },
    Incentivized: {
        borderTop: `1px solid ${theme.colors.gray20}`,
    },
    IncentivizedTitle: {
        fontSize: 24,
        fontWeight: 800,
        lineHeight: 1.12,
        marginBottom: 11,
        letterSpacing: -1,
        textAlign: 'left',
        fontStyle: 'normal',
        fontStretch: 'normal',
        color: theme.colors.primaryBlue,
    },
    IncentivizedSubTitle: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'left',
        marginBottom: 32,
        fontStyle: 'normal',
        fontStretch: 'normal',
        color: theme.colors.gray80,
    },
    IncentivizedSmallHeader: {
        fontSize: 20,
        lineHeight: 1.4,
        marginBottom: 15,
        textAlign: 'left',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fontStretch: 'normal',
        color: theme.colors.gray90,
    },
    IncentivizedLogos: {
        marginBottom: 20,
        '& div': {
            cursor: 'pointer',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            '&:nth-child(1)': {
                width: 103,
                height: 17,
                backgroundImage: 'url(https://s2.coinmarketcap.com/static/cloud/img/coinmarketcap_1.svg?_=df250fb)',
            },
            '&:nth-child(2)': {
                width: 103,
                height: 17,
                backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Binance_logo.svg/2560px-Binance_logo.svg.png)',
            },
            '&:nth-child(3)': {
                width: 61,
                height: 21,
                backgroundImage: 'url(data:image/png;base64,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)',
            },
            '&:nth-child(4)': {
                width: 92,
                height: 19,
                backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Uniswap_Logo_and_Wordmark.svg/2560px-Uniswap_Logo_and_Wordmark.svg.png)',

            },
            '&:nth-child(5)': {
                width: 92,
                height: 19,
                backgroundImage: 'url(https://cdn.freelogovectors.net/wp-content/uploads/2021/12/mexc_logo-freelogovectors.net_.png)',
            },
            '&:nth-child(6)': {
                width: 70,
                height: 16,
                backgroundImage: 'url(data:image/png;base64,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)',
            },
        },
    },
    FeedbackWrapper: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        '& div': {
            borderRadius: 16,
            backgroundColor: theme.colors.tint80,
        },
    },
    FeedbackSection: {
        marginTop: 0,
        padding: theme.spacing(4, 8, 8, 8),
    },
    Feedback: {
        borderRadius: 8,
    },
    SuccessLogo: {
        height: 320,
        width: '100%',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginBottom: theme.spacing(5),
    },
    Operator: {
        backgroundImage: 'url(/images/success_screen/operator/light.svg)',
    },
    Validator: {
        backgroundImage: 'url(/images/success_screen/validator/light.svg)',
    },
}));
