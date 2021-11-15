import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import { useStyles } from '~app/components/RegisterValidatorHome/components/AccountBalanceAndFee/AccountBalanceAndFee.styles';

const AccountBalanceAndFee = () => {
  const classes = useStyles();
    const history = useHistory();
  const [firstCheckBox, setFirstCheckBox] = useState(false);
  const [secondCheckBox, setSecondCheckBox] = useState(false);

  return (
    <Screen
      navigationText={translations.VALIDATOR.BALANCE_AND_FEE.NAVIGATION_TEXT}
      navigationLink={config.routes.VALIDATOR.SELECT_OPERATORS}
      title={translations.VALIDATOR.BALANCE_AND_FEE.TITLE}
      subTitle={translations.VALIDATOR.BALANCE_AND_FEE.SUB_TITLE}
      body={(
        <Grid>
          {translations.VALIDATOR.BALANCE_AND_FEE.BODY_TEXT.map((text: string) => {
              return (
                <Grid key={text} item>
                  <Typography className={classes.bodyText} variant="subtitle1">
                    {text}
                  </Typography>
                </Grid>
              );
            })}
          <Grid className={classes.ErrorTextWrapper}>
            <Typography className={classes.ErrorText}>
              Accounts with insufficient balance are at risk of being <a target={'_blank'} href={'Todo'}>liquidated</a>,
              which will result in inactivation <a target={'_blank'} href={'Todo'}>(penalties on the beacon chain) </a>
              of their validators, as they will no longer be operated by the network.
            </Typography>
          </Grid>
        </Grid>
      )}
      actionButton={(
        <CTAButton
          checkboxesText={[<span>I understand that fees might change according to market dynamics.</span>, <span>I understand the risks of having my account liquidated.</span>]}
          checkBoxesCallBack={[() => { setFirstCheckBox(!firstCheckBox); }, () => { setSecondCheckBox(!secondCheckBox); }]}
          testId={'submit-operator'}
          disable={!firstCheckBox || !secondCheckBox}
          onClick={() => { history.push(config.routes.VALIDATOR.SLASHING_WARNING); }}
          text={'Next'}
          />
      )}
    />
  );
};
export default observer(AccountBalanceAndFee);
