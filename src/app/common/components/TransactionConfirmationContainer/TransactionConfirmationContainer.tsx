import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import { useStyles } from './TransactionConfirmationContainer.styles';

type TransactionConfirmationContainerProps = {
  onButtonClick: () => void,
  buttonText?: any,
  buttonTestId?: string,
  agreement?: any,
  backNavigation?: any,
  header?: any,
  dataSections? : any,
  children?: any,
};

const TransactionConfirmationContainer = (props: TransactionConfirmationContainerProps) => {
  const { onButtonClick, buttonText, agreement, backNavigation,
    header, dataSections, children, buttonTestId } = props;
  const classes = useStyles();
  const checkboxLabelStyle = { fontSize: '14px' };
  const registerButtonStyle = { width: '100%', marginTop: 15 };
  const [userAgreed, setUserAgreed] = useState(!agreement?.length);

  const agreementComponent = agreement ? (
    <FormControlLabel
      control={(
        <Checkbox
          data-testid="terms-and-conditions-checkbox"
          checked={userAgreed}
          onChange={(event: any) => {
            setUserAgreed(!!event.target?.checked);
          }}
          color="primary"
        />
      )}
      label={(
        <Typography style={checkboxLabelStyle}>
          {agreement}
        </Typography>
      )}
      style={checkboxLabelStyle}
    />
  ) : '';

  return (
    <Paper className={classes.mainContainer}>
      {backNavigation ?? ''}
      {header ?? ''}
      <Grid container direction="column" justify="center" alignItems="center">
        {dataSections ? (
          <>
            {dataSections}
          </>
        ) : ''}
        {children ?? ''}
        <Grid container direction="row" justify="space-between" alignItems="center" item xs={12} md={12} spacing={1} className={classes.confirmationButtonContainer}>
          {agreementComponent}
          <CTAButton
            testId={buttonTestId ?? 'confirm-button'}
            disable={!userAgreed}
            style={registerButtonStyle}
            onClick={onButtonClick}
            text={buttonText}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(TransactionConfirmationContainer);
