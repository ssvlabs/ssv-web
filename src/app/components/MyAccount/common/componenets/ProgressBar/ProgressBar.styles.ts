import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    LiquidationProgress: {
        marginTop: '32px',
        height: '8px',
        width: '100%',
        backgroundColor: '#e1e5ec',
    },
    LiquidationProgressRed: {
        maxWidth: '100%',
        height: '8px',
        backgroundImage: 'linear-gradient(to right, #ff2d37 0%, #a74045), linear-gradient(to bottom, #e1e5ec, #e1e5ec)',
    },
}));
