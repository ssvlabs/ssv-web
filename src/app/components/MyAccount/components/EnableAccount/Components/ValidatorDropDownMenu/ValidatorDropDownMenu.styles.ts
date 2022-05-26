import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    DropDownWrapper: {
        cursor: 'pointer',
        paddingLeft: '8px',
    },
    ArrowDown: {
        height: '25px',
        marginRight: '12px',
        transitionDuration: '0.3s',
        transform: 'rotate(90deg)',
    },
    ArrowUp: {
        transform: 'rotate(180deg)',
    },
    OperatorsWrapper: {
        marginLeft: '4px',
        marginTop: '-6px',
        padding: '12px 0px 0px 36px',
        borderLeft: 'solid 2px #979797',
    },
    OperatorWrapper: {
      marginBottom: '12px',
    },
}));
