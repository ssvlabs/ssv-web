import  { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BorderScreen from '~app/components/common/BorderScreen';
import ConversionInput from '~app/components/common/ConversionInput/ConversionInput';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsMainnet } from '~app/redux/wallet.slice';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const ChangeFee = ({ newFee, onChangeHandler, error, nextIsDisabled, onNextHandler, setCurrency }: UpdateFeeProps) => {
  const classes = useStyles({});
  const isMainnet = useAppSelector(getIsMainnet);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      header={'Update Fee'}
      withoutBorderBottom={true}
      body={[
        <Grid container className={classes.ChangeFeeWrapper}>
          <Typography className={classes.ChangeFeeText} fontSize={16}>Enter your new operator annual fee.</Typography>
          <ConversionInput value={newFee} onChange={onChangeHandler} error={error} setCurrency={setCurrency}/>
          <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)}
                                      isMainnet={isMainnet}>
            <PrimaryButton isDisabled={nextIsDisabled || (isMainnet && !isChecked)} text={'Next'}
                           onClick={onNextHandler} size={ButtonSize.XL}/>
          </TermsAndConditionsCheckbox>
        </Grid>,
      ]}
    />
  );
};

export default ChangeFee;
