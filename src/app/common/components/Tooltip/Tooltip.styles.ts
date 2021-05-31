import { makeStyles } from '@material-ui/core/styles';

const bloxColor = '#3f51b5';

export const useStyles = makeStyles(() => ({
    toolTipWrapper: {
        position: 'relative',
        display: 'inline-block',
    },
    image: {
        width: '20px',
    },
    toolTipText: {
        width: '200px',
        color: '#fff',
        backgroundColor: bloxColor,
        textAlign: 'center',
        borderRadius: '6px',
        padding: '10px 0',
        bottom: '-20%',
        left: '100%',
        transition: 'opacity 0.3s',
        position: 'absolute',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: bloxColor,
    },
    toolTipLink: {
        color: '#fff',
    },
}));
