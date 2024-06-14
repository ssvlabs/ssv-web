import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import LinkText from '~app/components/common/LinkText';
import { ButtonSize } from '~app/enums/Button.enum';
import { invalidateOperatorBalance } from '~app/hooks/operator/useOperatorBalance';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { UpdateFeeProps } from '~app/model/operator.model.ts';
import { getSelectedOperator } from '~app/redux/account.slice.ts';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { decreaseOperatorFee } from '~root/services/operatorContract.service';

const DecreaseFlow = ({ oldFee, newFee, currency }: UpdateFeeProps) => {
  const navigate = useNavigate();
  const classes = useStyles({});
  const [buttonText, setButtonText] = useState('Update Fee');
  const [updated, setUpdated] = useState(false);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const operator = useAppSelector(getSelectedOperator)!;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const onUpdateFeeHandle = async () => {
    if (updated) {
      navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
    } else {
      setIsLoading(true);
      const res = await decreaseOperatorFee({
        operator,
        newFee,
        isContractWallet,
        dispatch
      });
      if (res) {
        setButtonText('Back To My Account');
        invalidateOperatorBalance(operator.id);
        setUpdated(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      header={'Update Fee'}
      withoutBorderBottom={true}
      body={[
        <Grid container className={classes.ChangeFeeWrapper}>
          <Typography>
            {updated ? 'You have successfully updated your fee. The new fee will take effect immediately.' : 'Your new operator annual fee will be updated to.'}
          </Typography>
          <ChangeFeeDisplayValues currentCurrency={currency} newFee={newFee} oldFee={oldFee} />
          {!updated && (
            <Grid item className={classes.Notice}>
              <Grid item className={classes.BulletsWrapper}>
                {Number(newFee) === 0 ? (
                  <div>Please note that operators who have set their fee to 0 will not have the option to increase or modify their fee in the future.'</div>
                ) : (
                  <div>
                    Keep in mind that the process of increasing your fee is different than decreasing it, and returning back to your current fee in the future would take longer.
                    Read more on <LinkText link={config.links.SSV_UPDATE_FEE_DOCS} textSize={14} text={'fee changes'} />
                  </div>
                )}
              </Grid>
            </Grid>
          )}
          <PrimaryButton text={buttonText} isLoading={isLoading} onClick={onUpdateFeeHandle} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default DecreaseFlow;
