import React from 'react';
import { observer } from 'mobx-react';
import Link from '@material-ui/core/Link';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useStyles } from './ValidatorKeyInput.styles';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';

type ValidatorPrivateKeyInputProps = {
  validatorKey: string,
  link?: string,
  newTab?: boolean,
  image?: string, 
  imageCallBack?: any,
};

const ValidatorKeyInput = (props: ValidatorPrivateKeyInputProps) => {
  const classes = useStyles();
  const { validatorKey, link, newTab = true, image, imageCallBack } = props;
  const beaconchaBaseUrl = getBaseBeaconchaUrl();
  const href: string = link || `${beaconchaBaseUrl}/validator/${validatorKey}`;
  const shouldBlank: string = newTab ? '_blank' : '';
  const img: string = image ?? '/images/external_link.svg';
  return (
    <OutlinedInput
      className={classes.wideWidthInput}
      data-testid="validator-private-key-slashing-input"
      type="text"
      inputProps={{ className: classes.input }}
      value={validatorKey}
      endAdornment={(
        <Link href={href} target={shouldBlank} onClick={() => { imageCallBack && imageCallBack(); }}>
          <InputAdornment position="end" className={classes.inputAddonContainer}>
            <img src={img} alt="Beaconcha.in" className={classes.inputAddonImage} />
          </InputAdornment>
        </Link>
      )}
      labelWidth={0}
      readOnly
    />
  );
};

export default observer(ValidatorKeyInput);