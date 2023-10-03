import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    EditIcon: {
        width: 16,
        height: 16,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/pencil/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    Text: {
        fontSize: 16,
        fontWeight: 500,
        color: theme.colors.gray80,
    },
    InfoText: {
        fontSize: 16,
        fontWeight: 500,
        color: theme.colors.gray40,
    },
    HeaderWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    HeaderInner: {
        gap: 8,
        display: 'flex',
        alignItems: 'center',
    },
    InputLabelWrapper: {
        display: 'flex',
    },
    ErrorMessage: {
        fontSize: 14,
        fontWeight: 600,
        display: 'flex',
        margin: '5px 5px',
        alignItems: 'center',
        color: theme.colors.primaryError,
    },
    SwitchClassName : {
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: theme.colors.primaryBlue,
                '& + .MuiSwitch-track': {
                    backgroundColor: 'white',
                    opacity: 1,
                    border: `1px solid ${theme.colors.primaryBlue}`,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                backgroundColor: theme.colors.gray40,

                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                backgroundColor: theme.colors.gray40,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
            backgroundColor: (props: any) => !props.isPermissionedOperator && theme.colors.gray40,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.gray40}`,
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    },
}));

