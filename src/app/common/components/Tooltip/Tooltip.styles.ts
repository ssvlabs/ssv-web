import { makeStyles } from '@material-ui/core/styles';

const bloxColor = '#0000ff';

export const useStyles = makeStyles(() => ({
    toolTipWrapper: {
        position: 'relative',
        display: 'inline-block',
    },
    image: {
        verticalAlign: 'middle',
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
