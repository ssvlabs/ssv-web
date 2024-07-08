import Grid from '@mui/material/Grid';
import { useStyles } from './NewWhiteWrapper.styles';
import OperatorsFlow from '~app/components/common/NewWhiteWrapper/components/OperatorsFlow';
import ValidatorsFlow from '~app/components/common/NewWhiteWrapper/components/ValidatorsFlow';

type Props = {
  type: WhiteWrapperDisplayType;
  header: any;
  children?: any;
  mainFlow?: boolean;
  stepBack?: Function;
};

export enum WhiteWrapperDisplayType {
  VALIDATOR = 'VALIDATOR',
  OPERATOR = 'OPERATOR'
}

const NewWhiteWrapper = (props: Props) => {
  const { type, header, children, mainFlow, stepBack } = props;
  const classes = useStyles({ mainFlow });

  return (
    <Grid container item className={classes.WhiteWrapper}>
      <Grid item container className={classes.Wrapper}>
        {type === WhiteWrapperDisplayType.OPERATOR ? <OperatorsFlow header={header} mainFlow={mainFlow} /> : <ValidatorsFlow stepBack={stepBack} header={header} />}
        <Grid container item xs={12} className={classes.ChildWrapper}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewWhiteWrapper;
