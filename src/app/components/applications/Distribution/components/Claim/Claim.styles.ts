import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    ErrorMessage: {
        gap: 10,
        height: 47,
        display: 'flex',
        borderRadius: 2,
        margin: '20px 0',
        padding: '12px 16px',
        alignItems: 'center',
        flexDirection: 'row',
        color: theme.colors.black,
        border: 'solid 1px #ec1c26',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.primaryErrorRegular,
    },
    EligibleWrapper: {
        marginTop: 20,
    },
    Eligible: {
        height: 93,
        borderRadius: 8,
        border: 'solid 1px #bbe4fd',
        padding: '27px 35px 26px 32px',
        backgroundColor: theme.colors.tint90,
    },
    EligibleAmount: {
        fontSize: 28,
        fontWeight: 500,
        lineHeight: 1.24,
        textAlign: 'left',
        fontStyle: 'normal',
        fontStretch: 'normal',
        letterSpacing: '-0.5px',
        color: theme.colors.shade80,
    },
    CompanyIcon: {
        height: 40,
        width: 28.5,
        marginRight: 12,
        marginLeft: 'auto',
        backgroundImage: `url(/images/logo/${theme.darkMode ? 'small_light' : 'small_light'}.svg)`,
    },
    CtaButton: {
        marginTop: 40,
    },
}));
