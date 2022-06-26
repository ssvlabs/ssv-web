import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Stepper: {
        marginBottom: 40,
    },
    Line: {
        height: 4,
        width: 154,
        flexGrow: 2,
        borderRadius: 8,
        '&:nth-of-type(2)': {
            backgroundColor: (props: any) => {
                if (props.step === 0) {
                    return theme.colors.gray20;
                }
                return theme.colors.primaryBlue;
            },
        },
        '&:nth-of-type(4)': {
            backgroundColor: (props: any) => {
                if (props.step <= 1) {
                    return theme.colors.gray20;
                }
                return theme.colors.primaryBlue;
            },
        },
        '&:nth-of-type(6)': {
            backgroundColor: (props: any) => {
                if (props.step === 4) {
                    return theme.colors.primaryError;
                }
                if (props.step <= 2) {
                    return theme.colors.gray20;
                }
                return theme.colors.primaryBlue;
            },
        },
        '&:nth-of-type(8)': {
            backgroundColor: (props: any) => {
                if (props.step === 0) {
                    return theme.colors.gray20;
                }
                return theme.colors.primaryBlue;
            },
        },
    },
    ProgressBarWrapper: {
        gap: 4,
        display: 'flex',
        alignItems: 'center',
    },
    ProgressBarTextWrapper: {
        marginTop: 12,
        justifyContent: 'space-between',
    },
    ProgressBarText: {
        fontSize: 14,
        lineHeight: 1.62,
        textAlign: (props: any) => props.subTextAlign,
        '&:nth-child(1)': {
            fontWeight: (props: any) => (props.step === 0 && props.registerButtonEnabled) ? 800 : 500,
            color: (props: any) => (props.step === 0 && props.registerButtonEnabled) ? theme.colors.gray80 : theme.colors.gray60,
        },
        '&:nth-child(2)': {
            fontWeight: (props: any) => props.step === 1 ? 800 : 500,
            color: (props: any) => props.step === 1 ? theme.colors.gray80 : theme.colors.gray60,
        },
        '&:nth-child(3)': {
            fontWeight: (props: any) => props.step === 2 ? 800 : 500,
            color: (props: any) => props.step === 2 ? theme.colors.gray80 : theme.colors.gray60,
        },
        '&:nth-child(4)': {
            fontWeight: 500,
            color: theme.colors.gray60,
        },
    },
    WaitingPeriod: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.primaryBlue,
    },
    ExpiresIn: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'center',
        color: theme.colors.primaryError,
    },
    StepWrapper: {
        width: 24,
        height: 24,
        flexGrow: 1,
        borderRadius: 16,

        // first circle
        '&:nth-of-type(1)': {
            border: (props: any) => {
                return props.step === 0 ? `3px solid ${theme.colors.primaryBlue}` : 'none';
            },
            backgroundImage: (props: any) => {
                if (props.step === 0) {
                    return 'none';
                }
                return `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`;
            },
        },
        // second circle
        '&:nth-of-type(3)': {
            border: (props: any) => {
                if (props.step === 1) {
                    return `2px solid ${theme.colors.primaryBlue}`;
                }
                return 'none';
            },
            backgroundColor: (props: any) => {
                if (props.step < 1) {
                    return theme.colors.gray20;
                }
                return theme.colors.white;
            },
            backgroundImage: (props: any) => {
                if (props.step < 2) {
                    return 'none';
                }
                return `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`;
            },
        },
        // third circle
        '&:nth-of-type(5)': {
            border: (props: any) => {
                if (props.step === 2) {
                    return `2px solid ${theme.colors.primaryBlue}`;
                }
                return 'none';
            },
            backgroundColor: (props: any) => {
                if (props.step === 4) {
                    return theme.colors.primaryError;
                }
                if (props.step === 2) {
                    return theme.colors.primaryBlue;
                }
                if (props.step < 2) {
                    return theme.colors.gray20;
                }
                return 'none';
            },
            backgroundImage: (props: any) => {
                if (props.step === 4) {
                    return 'url(/images/x/white.svg)';
                }
                if (props.step > 2) {
                    return `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`;
                }
                return 'none';
            },
        },
        // forth circle
        '&:nth-of-type(7)': {
            backgroundColor: (props: any) => {
                if (props.step === 4) {
                    return theme.colors.primaryError;
                }
                if (props.step < 3) {
                    return theme.colors.gray20;
                }
                return 'none';
            },
            backgroundImage: (props: any) => {
                if (props.step === 4) {
                    return theme.colors.primaryError;
                }
                if (props.step === 3) {
                    return `url(/images/checkbox/${theme.darkMode ? 'dark' : 'light'}.svg)`;
                }
                return 'none';
            },
        },
    },

    BulletsWrapper: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray60,
        '& ul': {
            margin: 0,
            paddingLeft: 16,
        },
    },
    ButtonsWrapper: {
        gap: 24,
    },
    CancelButton: {
        height: 60,
        width: '100%',
        fontSize: 16,
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
    Notice: {
        gap: 10,
        borderRadius: 2,
        display: 'flex',
        marginBottom: 24,
        padding: '12px 16px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.primaryWarningRegular,
        border: `solid 1px ${theme.colors.primaryWarningRegular}`,
    },
    InputText: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
    },
    InputWrapper: {
        gap: 8,
        justifyContent: 'space-between',
    },
    TextError: {
        color: 'red',
        marginTop: 4,
        zIndex: 9123123,
        fontSize: '0.8rem',
    },
    TextWrapper: {
        gap: 12,
        marginBottom: 40,
        color: theme.colors.gray80,
    },
    FeesChangeWrapper: {
        gap: 12,
        marginBottom: (props: any) => props.lastStep ? 24 : 40,
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
    Arrow: {
        width: 29,
        height: 29,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/arrow/light.svg)',
    },
    Step: {
        gap: 10,
        height: 26,
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 4,
        display: 'flex',
        lineHeight: 1.62,
        padding: '1px 6px',
        alignItems: 'center',
        justifyContent: 'center',
        border: (props: any) => {
            if (props.expiredStep) {
                return `1px solid ${theme.colors.primaryError}`;
            }
            if (props.lastStep) {
                if (theme.darkMode) return `1px solid ${theme.colors.primaryBlue}`;
            }
            if (props.step3) {
                return `1px solid ${theme.colors.tint20}`;
            }
            return `1px solid ${theme.colors.tint20}`;
        },
        color: (props: any) => {
            if (props.expiredStep) {
                return theme.colors.primaryError;
            }
            if (props.lastStep) {
                if (theme.darkMode) return theme.colors.primaryBlue;
                return theme.colors.white;
            }
            if (props.step3) {
                return theme.colors.primaryBlue;
            }
            return theme.colors.primaryBlue;
        },
        backgroundColor: (props: any) => {
            if (props.expiredStep) {
                return theme.colors.primaryErrorRegular;
            }
            if (props.lastStep) {
                if (theme.darkMode) return 'transparent';
                return theme.colors.primaryBlue;
            }
            if (props.step3) {
                return theme.colors.tint90;
            }
            return theme.colors.tint90;
        },
    },
    Title: {
        fontSize: 20,
        lineHeight: 1.4,
        fontWeight: 'bold',
        color: theme.colors.gray90,
    },
    HeaderWrapper: {
        gap: 8,
        marginBottom: 24,
        alignItems: 'center',
    },
    StepperWrapper: {
        padding: 0,
        marginBottom: 40,
    },
}));