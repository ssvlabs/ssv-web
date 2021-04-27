import { withStyles } from '@material-ui/core/styles';

const classWithStyles = (styles: any): any => {
    return (Component: any) => {
        return withStyles(styles)(Component);
    };
};

export {
    classWithStyles,
};
