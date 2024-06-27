import { Grid } from '~app/atomicComponents';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import config from '~app/common/config';
import { useStyles } from './SetOperatorFee.styles';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import { validateFeeInput } from '~lib/utils/validatesInputs';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook.ts';
import { getMaxOperatorFeePerYear } from '~app/redux/operator.slice.ts';
import WarningBox from '~app/components/common/WarningBox';
import ErrorMessage from '~app/components/common/ErrorMessage';

type UserInput = string;

const INITIAL_ERROR_STATE = { shouldDisplay: false, errorMessage: '' };

const SetOperatorFee = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const maxFee = useAppSelector(getMaxOperatorFeePerYear);
  const { operatorRawData, isPrivate } = location.state;
  const [error, setError] = useState(INITIAL_ERROR_STATE);
  const [userInput, setUserInput] = useState<UserInput>('');
  const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);

  useEffect(() => {
    if (userInput === '') {
      setError(INITIAL_ERROR_STATE);
      setRegisterButtonDisabled(true);
      return;
    }
    validateFeeInput({
      value: userInput,
      maxFee,
      callback: setError,
      isPrivate
    });
    setUserInput(removeLeadingZeros(userInput));
    const isRegisterButtonDisabled = typeof userInput === 'object' || error.shouldDisplay;
    setRegisterButtonDisabled(isRegisterButtonDisabled);
  }, [error.shouldDisplay, userInput]);

  const moveToSubmitConfirmation = () => {
    operatorRawData.fee = parseFloat(userInput) || 0;
    navigate(config.routes.SSV.OPERATOR.CONFIRMATION_PAGE, { state: { operatorRawData, isPrivate } });
  };

  const removeLeadingZeros = (num: string): string => {
    const stripped = num.toString().replace(/^0+(?!\.)/, '');
    return stripped === '' ? '0' : stripped;
  };

  const verifyFeeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value.trim());
  };

  return (
    <BorderScreen
      body={[
        <Grid container style={{ position: 'relative', gap: 0 }}>
          <HeaderSubHeader title={'Set Operator Fee'} />
          <Grid item container style={{ gap: 24 }}>
            <Typography className={classes.Text}>
              The ssv network utilizes the SSV token to facilitate payments between stakers to operators for maintaining their validators.
            </Typography>
            <Typography className={classes.Text}>
              Operators set their own fees, denominated in SSV tokens, to be charged per each validator that selects them as one of their operators.
            </Typography>
            <Typography className={classes.Text}>
              Fees are presented as annual payments, but in practice are paid to operators continuously as an ongoing process - per each passed block.
            </Typography>
            <Typography className={classes.Text}>Your earnings are paid to your ssv operator balance, and can be withdrawn to your wallet at any time.</Typography>
            <Grid className={classes.Text}>
              Please note that you could always change your fee (according to <br /> the <LinkText text={'limitations'} link={config.links.SSV_UPDATE_FEE_DOCS} />) to align with
              market dynamics, such as competitiveness and SSV price fluctuations.
            </Grid>
          </Grid>
          <Grid item container className={classes.InputWrapper} style={{ gap: 24 }}>
            <Grid item container style={{ gap: 24 }}>
              <Grid item container>
                <Grid item className={classes.InputText}>
                  <Typography>Annual fee</Typography>
                </Grid>
                <TextInput
                  isShowSsvLogo
                  withSideText
                  value={userInput}
                  placeHolder={'0.0'}
                  showError={error.shouldDisplay}
                  dataTestId={'edit-operator-fee'}
                  onChangeCallback={verifyFeeNumber}
                />
              </Grid>
              {isPrivate && userInput && Number(userInput) === 0 && <WarningBox text={'If you set your fee to 0 you will not be able to change it in the future'} />}
              {error.shouldDisplay && <ErrorMessage text={error.errorMessage} />}
            </Grid>
            <PrimaryButton text={'Next'} isDisabled={registerButtonDisabled} onClick={moveToSubmitConfirmation} size={ButtonSize.XL} />
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default SetOperatorFee;
