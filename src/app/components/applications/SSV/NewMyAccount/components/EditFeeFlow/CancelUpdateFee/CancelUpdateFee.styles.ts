import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    DialogWrapper: {
        margin: 'auto',
    },
    CloseDialog: {
        top: -19,
        right: -25,
        width: 200,
        height: 345,
        position: 'absolute',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // backgroundImage: 'url(/images/backgroundIcon/light.svg)',
    },
    GridWrapper: {
        gap: 24,
        width: 424,
        padding: 32,
        flexDirection: 'column',
        backgroundColor: theme.colors.white,
    },
    BackgroundImage: {
        top: -19,
        right: -23,
        width: 226,
        height: 283,
        position: 'absolute',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/backgroundIcon/light.svg)',
    },
    CurrentFeeWrapper: {
      gap: 16,
    },
    CancelSubText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        fontStyle: 'normal',
        fontStretch: 'normal',
        letterSpacing: 'normal',
        color: theme.colors.gray80,
    },
    BackToMyAccount: {
        height: 48,
    },
    NegativeArrow: {
        width: 29,
        height: 29,
        cursor: 'pointer',
        transform: 'rotate(180deg)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/arrow/light_red.svg)',
    },
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    Line: {
        border: `solid 1px ${theme.colors.gray20}`,
    },
    FirstButton: {
        height: 48,
    },
    SecondButton: {
        height: 48,
        fontSize: 16,
        width: '100%',
        fontWeight: 600,
        borderRadius: 8,
        lineHeight: 1.25,
        transition: 'none',
        textTransform: 'unset',
        color: theme.colors.primaryBlue,
        fontFamily: 'Manrope !important',
        backgroundColor: theme.colors.white,
        border: `solid 1px ${theme.colors.primaryBlue}`,
        '&:hover': {
            backgroundColor: theme.colors.tint80,
        },
        '&:active': {
            backgroundColor: theme.colors.tint70,
        },
        '&:disabled': {
            border: 'none',
            color: theme.colors.gray40,
            backgroundColor: theme.colors.gray20,
        },
    },
}));