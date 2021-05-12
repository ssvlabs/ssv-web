import React from 'react';
import { observer } from 'mobx-react';
import Link from '@material-ui/core/Link';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import { useStyles } from './ValidatorPrivateKeyInput.styles';

type ValidatorPrivateKeyInputProps = {
  validatorPublicKey: string,
};

const ValidatorPrivateKeyInput = (props: ValidatorPrivateKeyInputProps) => {
  const classes = useStyles();
  const { validatorPublicKey } = props;
  const beaconchaBaseUrl = getBaseBeaconchaUrl();
  return (
    <OutlinedInput
      className={classes.wideWidthInput}
      data-testid="validator-private-key-slashing-input"
      type="text"
      value={validatorPublicKey}
      endAdornment={(
        <Link href={`${beaconchaBaseUrl}/validator/${validatorPublicKey}`} target="_blank">
          <InputAdornment position="end" className={classes.inputAddonContainer}>
            <img src="/images/etherscan.png" alt="Beaconcha.in" className={classes.inputAddonImage} />
          </InputAdornment>
        </Link>
      )}
      labelWidth={0}
      readOnly
    />
  );
};

export default observer(ValidatorPrivateKeyInput);
