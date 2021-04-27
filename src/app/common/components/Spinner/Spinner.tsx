import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { classWithStyles } from '~app/hooks/classWithStyles';

@classWithStyles({
    spinnerContainer: {
        display: 'flex',
        margin: 'auto',
    },
    spinner: {
        margin: 'auto',
    },
})
class Spinner extends React.Component<Record<string, any>> {
    render() {
        const { classes } = this.props;
        return (
          <div className={classes.spinnerContainer}>
            <CircularProgress style={{ margin: 'auto' }} />
          </div>
        );
    }
}

export default Spinner;
