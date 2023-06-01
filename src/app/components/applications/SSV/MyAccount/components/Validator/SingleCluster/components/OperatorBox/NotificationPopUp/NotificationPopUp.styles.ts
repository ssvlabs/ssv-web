import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    PopUpWrapper: {
        top: 190,
        left: 210,
        width: 610,
        zIndex: '99999',
        display: 'flex',
        borderRadius: 16,
        position:  'absolute',
        flexDirection: 'column',
        color: theme.colors.black,
        padding: '16px 16px 16px 16px',
        backgroundColor: theme.colors.white,
        boxShadow: '0 4px 27px 0 rgba(0, 0, 0, 0.1)',
    },
    CloseButtonWrapper: {
        width: '100%',
        display: 'flex',
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ClosePopUpButton: {
        width: 21,
        height: 21,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/x/light.svg)',
    },
    PopUpTitle: {
        fontSize: 18,
        fontWeight: 800,
        lineHeight: 1.8,
        color: theme.colors.black,
    },
    Line: {
        height: 1,
        width: '100%',
        marginTop: 25,
        marginBottom:   25,
        transform: 'rotate(-360deg)',
        backgroundColor: theme.colors.gray20,
    },
    ProcessesWrapper: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'space-around',
    },
    ProcessElement: {
        height: 150,
        width: '50%',
        display: 'flex',
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 25,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    ProcessText: {
        marginBottom: 25,
        color: theme.colors.black,
    },
    Step: {
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 4,
        lineHeight: 1.62,
        marginBottom: 20,
        padding: '1px 6px',
        color: (props: any) => {
            if (theme.darkMode) {
                return theme.colors.primaryBlue;
            }
            if (props.step === '1') {
                return theme.colors.gray60;
            }
            if (props.step === '2') {
                return theme.colors.primaryBlue;
            }
            if (props.step === '3') {
                return theme.colors.white;
            }
            if (props.step === '4') {
                return theme.colors.white;
            }
            return theme.colors.primaryBlue;},
        backgroundColor: (props: any) => {
            if (theme.darkMode) return 'transparent';
            if (props.step === '1') {
                return theme.colors.gray10;
            }
            if (props.step === '2') {
                return theme.colors.tint90;
            }
            if (props.step === '3') {
                return '#60bffa';
            }
            if (props.step === '4') {
                return theme.colors.primaryBlue;
            }
            return theme.colors.tint90;},
        },
}));