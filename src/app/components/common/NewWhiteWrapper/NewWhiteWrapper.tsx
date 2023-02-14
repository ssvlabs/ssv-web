import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStyles } from './NewWhiteWrapper.styles';
import OperatorsFlow from '~app/components/common/NewWhiteWrapper/components/OperatorsFlow';
import ValidatorsFlow from '~app/components/common/NewWhiteWrapper/components/ValidatorsFlow';

type Props = {
  type: Type,
  header: any,
  children?: any,
  mainFlow?: boolean,
};

// eslint-disable-next-line no-unused-vars
enum Type {
  // eslint-disable-next-line no-unused-vars
  VALIDATOR = 0,
  // eslint-disable-next-line no-unused-vars
  OPERATOR = 1,
}

const NewWhiteWrapper = (props: Props) => {
  const {
    type,
    header,
    children,
    mainFlow,
  } = props;
  const classes = useStyles({ mainFlow });


  return (
      <Grid container item className={classes.WhiteWrapper}>
        <Grid item container className={classes.Wrapper}>
          {type === Type.OPERATOR ? <OperatorsFlow header={header} mainFlow={mainFlow} /> : <ValidatorsFlow header={header} />}
          <Grid container item xs={12} className={classes.ChildWrapper}>
            {children}
          </Grid>
        </Grid>
      </Grid>
  );
};

export default observer(NewWhiteWrapper);
