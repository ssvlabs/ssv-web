import { makeStyles } from '@material-ui/core/styles';

const toolTipColor = '#d3fcf4';
const toolTipTextColor = '#637386';

export const useStyles = makeStyles(() => ({
    ToolTipWrapper: {
        marginLeft: 4,
        verticalAlign: 'middle',
    },
    ToolTip: {
        width: 16,
        height: 16,
        verticalAlign: 'middle',
        // backgroundColor: 'blue',
    },
    toolTipText: {
        position: 'absolute',
        width: '300px',
        // left: 100,
        boxShadow: '0px 5px 13px rgba(91, 108, 132, 0.16)',
        color: '#637386',
        backgroundColor: toolTipColor,
        textAlign: 'center',
        borderRadius: '6px',
        padding: '10px 0',
        // bottom: -100,
        transition: 'opacity 0.3s',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: toolTipColor,
    },
    toolTipLink: {
        color: toolTipTextColor,
    },
}));