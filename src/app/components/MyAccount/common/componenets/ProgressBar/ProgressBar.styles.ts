import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    LiquidationProgress: {
        height: '8px',
        width: '100%',
        marginTop: '32px',
        backgroundColor: '#e1e5ec',
    },
    LiquidationProgressRed: {
        height: '8px',
        borderRadius: 5,
        maxWidth: '100%',
        backgroundImage: 'linear-gradient(to right, #ff2d37 0%, #a74045), linear-gradient(to bottom, #e1e5ec, #e1e5ec)',
    },
}));
