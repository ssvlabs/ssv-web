import { makeStyles } from '@material-ui/core/styles';

const toolTipColor = '#d3fcf4';
const toolTipTextColor = '#637386';

export const useStyles = makeStyles(() => ({
    toolTipWrapper: {
        position: 'relative',
        display: 'inline-flex',
    },
    image: {
        verticalAlign: 'middle',
    },
    toolTipText: {
        boxShadow: '0px 5px 13px rgba(91, 108, 132, 0.16)',
        width: '200px',
        color: '#637386',
        backgroundColor: toolTipColor,
        textAlign: 'center',
        borderRadius: '6px',
        padding: '10px 0',
        bottom: '-20%',
        left: '100%',
        transition: 'opacity 0.3s',
        position: 'absolute',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: toolTipColor,
    },
    toolTipLink: {
        color: toolTipTextColor,
    },
}));
