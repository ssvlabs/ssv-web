import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Header: {
        fontSize: 20,
        lineHeight: 1.4,
        fontWeight: 'bold',
        color: theme.colors.gray90,
        marginBottom: theme.spacing(3),
    },
    SubHeader: {
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
