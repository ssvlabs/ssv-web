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
