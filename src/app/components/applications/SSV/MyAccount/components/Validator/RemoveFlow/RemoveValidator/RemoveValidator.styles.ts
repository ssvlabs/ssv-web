import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Wrapper: {
        marginTop: 24,
    },
    SubHeaderWrapper: {
        gap: 8,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        paddingBottom: 30,
        color: theme.colors.gray80,
    },
    Section: {
        padding: '12px 32px 32px',
    },
    BulletsWrapper: {
        paddingLeft: 24,
        margin: 0,
    },
    Bullet: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    SecondHeader: {
        fontSize: 20,
        marginTop: 40,
        lineHeight: 1.4,
        fontWeight: 'bold',
        color: theme.colors.gray90,
    },
    Warning: {
        gap: 10,
        height: 70,
        fontSize: 14,
        marginTop: 20,
        borderRadius: 2,
        fontWeight: 500,
        display: 'flex',
        lineHeight: 1.62,
        padding: '12px 16px',
        alignItems: 'center',
        flexDirection: 'row',
        color: theme.colors.gray90,
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.primaryWarningRegular,
        border: `solid 1px ${theme.colors.primaryWarningRegular}`,
    },
    CheckBoxWrapper: {
        marginTop: 40,
    },
}));