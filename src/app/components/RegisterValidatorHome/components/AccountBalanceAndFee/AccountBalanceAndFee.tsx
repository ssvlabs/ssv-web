import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import config, { translations } from '~app/common/config';
import Checkbox from '~app/common/components/CheckBox/CheckBox';
import PrimaryButton from '~app/common/components/PrimaryButton/PrimaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/RegisterValidatorHome/components/AccountBalanceAndFee/AccountBalanceAndFee.styles';

const AccountBalanceAndFee = () => {
  const classes = useStyles();
    const history = useHistory();
  const [firstCheckBox, setFirstCheckBox] = useState(false);
  const [secondCheckBox, setSecondCheckBox] = useState(false);
  
      return (
        <BorderScreen
          header={translations.VALIDATOR.BALANCE_AND_FEE.TITLE}
          link={{ to: config.routes.VALIDATOR.SELECT_OPERATORS, text: 'Back' }}
          body={[
            <Grid container>
              <Grid item container className={classes.bodyTextWrapper}>
                {translations.VALIDATOR.BALANCE_AND_FEE.BODY_TEXT.map((text: string) => {
                          return (
                            <Grid item className={classes.bodyText} key={text}>
                              {text}
                            </Grid>
                          );
                      })}
              </Grid>
              <Grid item container className={classes.ErrorTextWrapper}>
                <Grid className={classes.ErrorText}>
                  Accounts with insufficient balance are at risk of being <a target={'_blank'} href={'Todo'}>liquidated</a>,
                  which will result in inactivation <a target={'_blank'} href={'Todo'}>(penalties on the beacon chain) </a>
                  of their validators, as they will no longer be operated by the network.
                </Grid>
              </Grid>
              <Checkbox
                onClickCallBack={setFirstCheckBox}
                text={'I understand that fees might change according to market dynamics'}
                />
              <Checkbox
                onClickCallBack={setSecondCheckBox}
                text={'I understand the risks of having my account liquidated'}
                />
              <PrimaryButton
                disable={!firstCheckBox || !secondCheckBox}
                text={'Next'}
                onClick={() => { history.push(config.routes.VALIDATOR.SLASHING_WARNING); }}
              />
            </Grid>,
          ]}
        />
      );
};
export default observer(AccountBalanceAndFee);
