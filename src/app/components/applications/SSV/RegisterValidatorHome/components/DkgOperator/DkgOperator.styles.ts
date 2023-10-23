import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    OperatorDetails: {
        width: 400,
        height: 69,
        border: `1px solid ${theme.colors.gray20}`,
        marginTop: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px 10px 20px',
    },
    OperatorLogo: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(230, 234, 247, 0.5)',
        backgroundImage: (props: any) => `url(${props.operatorLogo ? props.operatorLogo : '/images/operator_default_background/light.svg'})`,
    },
    OperatorName: {
        color: theme.colors.gray90,
    },
    OperatorId: {
        fontSize: 14,
        fontWeight: 500,
        color: theme.colors.gray40,
    },
    OperatorNameAndIdWrapper: {
        gap: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    DkgEnabledBudge: {
        height: 26,
        fontSize: 14,
        fontWeight: 500,
        display: 'flex',
        borderRadius: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1px 6px 1px 6px',
        color: (props: any) => props.dkgEnabled ? theme.colors.primarySuccessDark : theme.colors.primaryError,
        backgroundColor: (props: any) => props.dkgEnabled ? theme.colors.primarySuccessRegularOpacity : theme.colors.primaryErrorRegular,
    },
}));