import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Box: {
    },
    BoxesWrapper: {
        gap: 24,
        width: 1320,
        height: 604,
        margin: 'auto',
        '@media only screen and (max-width: 1400px)': {
            width: '100%',
            flexDirection: 'column',
        },
    },
    BigBox: {
        gap: 68,
        width: 872,
        borderRadius: 16,
        backgroundColor: theme.colors.squareScreenBackground,
    },
    BoxWrapper: {
        gap: 24,
        width: 424,
        '@media only screen and (max-width: 1400px)': {
            width: '100%',
            flexDirection: 'column',
        },
    },
    TableWrapper: {
        width: 872,
    },
    OperatorLogo: {
        height: 19,
        width: 16.5,
        borderRadius: 4,
        alignContent: 'flex-end',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(230, 234, 247, 0.5)',
        backgroundImage: (props: any) => `url(${props.logo ?? '/images/operator_default_background/light.svg'})`,
    },
    Wrapper: {
    },
    ItemsWrapper: {
        gap: 90,
    },
    TableKey: {
        fontSize: 14,
        fontWeight: 500,
        marginBottom: 8,
        lineHeight: 1.62,
        color: theme.colors.gray40,
    },
    SecondSectionWrapper: {
        gap: 24,
        width: 1320,
        margin: 'auto',
        marginTop: 24,
        '@media only screen and (max-width: 1400px)': {
            width: '80%',
            marginTop: 24,
            margin: 'auto',
            flexDirection: 'column',
        },
    },
    OperatorsValidatorsTable: {
        width: 872,
        height: (props: any) => props.noValidators ? 286 : '',
        borderRadius: (props: any) => props.noValidators ? 16 : '',
        backgroundColor: (props: any) => props.noValidators ? theme.colors.white : '',
        '@media only screen and (max-width: 1400px)': {
            width: '100%',
        },
    },
    NoRecordImage: {
        width: 100,
        height: 100,
        margin: 'auto',
        marginTop: 40,
        marginBottom: 40,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/logo/gray.svg)',
    },
    NoRecordsText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'center',
        '&:nth-child(2)': {
            fontWeight: 'bold',
            color: theme.colors.black,
        },
        '&:nth-child(3)': {
            color: theme.colors.gray40,
            marginBottom: 131,
        },
    },
    AnnualWrapper: {
        width: 424,
        height: 290,
        maxHeight: 290,
        marginTop: 0,
        '@media only screen and (max-width: 1400px)': {
            width: '100%',
        },
    },
    AnnualSection: {
        padding: '24px 32px 32px 32px',
    },
    ButtonSection: {
        border: 'none',
        padding: theme.spacing(8),
        borderTop: '1px solid rgba(230, 234, 247, 0.5)',
    },
    NoValidatorImage: {
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: '191px auto 0px auto',
        backgroundImage: 'url(/images/logo/no_validators.svg)',
    },
    NoValidatorText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'center',
        color: theme.colors.gray80,
    },
    TableValueText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
    },
    ItemWrapper: {
        gap: 8,
        alignItems: 'center',
    },
    ExtraButtonWrapper: {
        gap: 8,
        justifyContent: 'flex-end',
    },
    copyImage: {
        width: 20,
        height: 20,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/copy/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    Section: {
        padding: '12px 32px 32px',
    },
    UpdateFeeTooltipText: {
        fontSize: 12,
   },
    LinkText: {
        fontSize: 12,
        cursor: 'pointer',
        display: 'inline-block',
        overflowWrap: 'break-word',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
}));