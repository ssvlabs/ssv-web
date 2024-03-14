import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Header: {
        zIndex: 9,
        fontSize: 20,
        lineHeight: 1.4,
        fontWeight: 'bold',
        color: theme.colors.gray90,
        marginBottom: (props: any) => {
            if (props.marginBottom) return props.marginBottom;
            return theme.spacing(3);
        },
    },
    SubHeader: {
        zIndex: 9,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
        marginBottom: (props: any) => {
            if (props.marginBottom) return props.marginBottom;
            if (props.rewardPage) return theme.spacing(2);
            return theme.spacing(10);
        },
    },
}));
