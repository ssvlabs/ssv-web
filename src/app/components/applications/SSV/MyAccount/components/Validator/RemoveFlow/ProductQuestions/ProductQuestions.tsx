import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import Checkbox from '~app/components/common/CheckBox';
import TextInput from '~app/components/common/TextInput';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import { useStyles } from './ProductQuestions.styles';

const checkBoxTypes: any = {
  1: 'fees',
  2: 'performance',
  3: 'maintenance',
  4: 'other',
};

const ProductQuestions = () => {
  const classes = useStyles();
  const history = useHistory();
  const [inputValue, setInputValue] = React.useState('');
  const [textFieldOpen, setTextFieldOpen] = React.useState(false);
  const [thankYouDialog, openThankYouDialog] = React.useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = React.useState(0);

  const openTextField = () => {
    setTextFieldOpen(!textFieldOpen);
  };

  const checkBoxCallBack = (type: number) => {
    if (type === 4) {
      openTextField();
    }

    if (type === selectedCheckbox) {
      setSelectedCheckbox(0);
    } else {
      setSelectedCheckbox(type);
    }
  };

  const submitAnswer = () => {
    openThankYouDialog(true);
    GoogleTagManager
      .getInstance()
      .sendEvent({ category: 'remove', action: checkBoxTypes[selectedCheckbox], label: inputValue });
    setTimeout(() => {
      openThankYouDialog(false);
      history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
    }, 3000);
  };

  const backToMyAccount = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'navigate',
      action: 'my_account',
      label: '',
    });
    history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
  };

  const isDisabled = (type: number) => {
    return type !== selectedCheckbox && selectedCheckbox !== 0;
  };

  return (
    <Grid container item>
      <ValidatorWhiteHeader withBackButton={false} withoutExplorer withCancel={false} text={'Remove Validator'} />
      <BorderScreen
        blackHeader
        withoutNavigation
        wrapperClass={classes.ProductQuestionsWrapper}
        header={'Your validator was successfully removed'}
        body={[
          <Grid container item>
            <HeaderSubHeader
              subtitle={'Your validator has been successfully removed from the robust and secure infrastructure of our network'} />
            <Grid container item>
              <HeaderSubHeader
                title={'Help us learn!'}
                subtitle={<span>In order to improve and optimize, open sourced networks thrive on feedback and peer review.<br /> We’d love to hear what made you remove your validator.</span>}
              />
            </Grid>
            <Grid item>
              <Checkbox disable={isDisabled(1)} grayBackGround text={'I am looking for lower fees'}
                onClickCallBack={() => checkBoxCallBack(1)} />
              <Checkbox disable={isDisabled(2)} grayBackGround text={'I am not happy  with the validators performance'}
                onClickCallBack={() => checkBoxCallBack(2)} />
              <Checkbox disable={isDisabled(3)} grayBackGround
                text={'Validator monitoring and/or maintenance is a struggle'}
                onClickCallBack={() => checkBoxCallBack(3)} />
              <Checkbox disable={isDisabled(4)} grayBackGround text={'Other'}
                onClickCallBack={() => checkBoxCallBack(4)} />
            </Grid>
            {textFieldOpen && (
              <Grid container item className={classes.TextFieldWrapper}>
                <TextInput onChangeCallback={(e: any) => setInputValue(e.target.value)}
                  placeHolder={'Write your reason here...'} />
              </Grid>
            )}
            <Grid container item className={classes.ButtonsWrapper}>
              <Grid item xs>
                <SecondaryButton text={'Back to My Account'} submitFunction={backToMyAccount} />
              </Grid>
              <Grid item xs>
                <PrimaryButton text={'Submit Feedback'} submitFunction={submitAnswer} />
              </Grid>
            </Grid>
          </Grid>,
        ]}
      />
      <Dialog
        open={thankYouDialog}
        PaperProps={{
          className: classes.DialogWrapper,
          style: { width: 424, height: 318, borderRadius: 16, padding: 32 },
        }}
      >
        <HeaderSubHeader subtitle={<Typography>You are being redirected to <b>My Account</b></Typography>}
          title={'Thank you for your feedback!'} />
        <Grid style={{ alignSelf: 'center' }}>
          <img className={classes.Loader} src={getImage('ssv-loader.svg')} alt={'In progress..'} />
        </Grid>
      </Dialog>
    </Grid>
  );
};

export default observer(ProductQuestions);
