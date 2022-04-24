import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import config from '~app/common/config';
import Checkbox from '~app/common/components/CheckBox';
import TextInput from '~app/common/components/TextInput';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import SecondaryButton from '~app/common/components/SecondaryButton';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from './ProductQuestions.styles';

const checkBoxTypes: any = {
    'fees': 1,
    'performance': 2,
    'maintenance': 3,
    'other': 4,
};

const ProductQuestions = () => {
    const classes = useStyles();
    const history = useHistory();
    // @ts-ignore
    const { public_key } = useParams();
    const [inputValue, setInputValue] = React.useState(false);
    const [textFieldOpen, setTextFieldOpen] = React.useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = React.useState(0);

    const openTextField = () => {
        setTextFieldOpen(!textFieldOpen);
    };

    const checkBoxCallBack = (type: string) => {
        if (checkBoxTypes[type] === 4) {
            openTextField();
        }
        if (checkBoxTypes[type] === selectedCheckbox) {
            setSelectedCheckbox(0);
        } else {
            setSelectedCheckbox(checkBoxTypes[type]);
        }
    };

    const submitAnswer = () => {
        console.log(inputValue);
    };

    const backToMyAccount = () => {
        history.push(config.routes.MY_ACCOUNT.DASHBOARD);
    };

    const isDisabled = (type: number) => {
        return type !== selectedCheckbox && selectedCheckbox !== 0;
    };

    return (
      <Grid container item>
        <WhiteWrapper header={'Removed Validator'} withCancel={false}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>{public_key}</Typography>
            <ImageDiv image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
            <ImageDiv image={'beacon'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>
        <BorderScreen
          blackHeader
          withoutNavigation
          wrapperClass={classes.ProductQuestionsWrapper}
          header={'Your validator was successfully removed'}
          body={[
            <Grid container item>
              <HeaderSubHeader subtitle={'Your validator has been successfully removed from the robust and secure infrastructure of our network'} />
              <Grid container item>
                <HeaderSubHeader
                  title={'Help us learn!'}
                  subtitle={<span>In order to improve and optimize, open sourced networks thrive on feedback and peer review.<br /> We’d love to hear what made you remove your validator.</span>}
                />
              </Grid>
              <Grid item>
                <Checkbox disable={isDisabled(checkBoxTypes.fees)} grayBackGround text={'I am looking for lower fees'} onClickCallBack={() => checkBoxCallBack('fees')} />
                <Checkbox disable={isDisabled(checkBoxTypes.performance)} grayBackGround text={'I am not happy  with the validators performance'} onClickCallBack={() => checkBoxCallBack('performance')} />
                <Checkbox disable={isDisabled(checkBoxTypes.maintenance)} grayBackGround text={'Validator monitoring and/or maintenance is a struggle'} onClickCallBack={() => checkBoxCallBack('maintenance')} />
                <Checkbox disable={isDisabled(checkBoxTypes.other)} grayBackGround text={'Other'} onClickCallBack={() => checkBoxCallBack('other')} />
              </Grid>
              {textFieldOpen && (
                <Grid container item className={classes.TextFieldWrapper}>
                  <TextInput onChangeCallback={(e: any) => setInputValue(e.target.value)} placeHolder={'Write your reason here...'} />
                </Grid>
              )}
              <Grid container item className={classes.ButtonsWrapper}>
                <Grid item xs>
                  <SecondaryButton text={'Back to My Account'} onClick={backToMyAccount} />
                </Grid>
                <Grid item xs>
                  <PrimaryButton text={'Submit Feedback'} submitFunction={submitAnswer} />
                </Grid>
              </Grid>
            </Grid>,
          ]}
        />
      </Grid>
    );
};

export default observer(ProductQuestions);
