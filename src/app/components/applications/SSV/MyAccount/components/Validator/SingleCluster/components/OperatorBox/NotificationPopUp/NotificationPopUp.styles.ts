import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// import {
//     StepperSteps,
// } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

export const useStyles = makeStyles((theme: Theme) => ({
    PopUpWrapper: {
        top: 190,
        left: 210,
        width: 610,
        height: 691,
        zIndex: '99999',
        display: 'flex',
        borderRadius: 16,
        position:  'absolute',
        flexDirection: 'column',
        backgroundColor: '#fdfefe',
        justifyContent: 'space-around',
        padding: '16px 16px 16px 16px',
        boxShadow: '0 4px 27px 0 rgba(0, 0, 0, 0.1)',
    },
    CloseButtonWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
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
    },
    StepperWrapper: {
        // width: '100%',
        height: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    StatusWrapper: {
        width: '100%',
        height: 150,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        // alignItems: 'center',
        // backgroundColor: 'black',
    },
    Line: {
        height: 1,
        width: '100%',
        backgroundColor: '#e6eaf7',
        transform: 'rotate(-360deg)',
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
        flexDirection: 'column',
        alignItems: 'flex-start',
        // justifyContent: 'space-around',
    },
    Step: {
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 4,
        lineHeight: 1.62,
        marginBottom: 20,
        padding: '1px 6px',
        color: (props: any) => {
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