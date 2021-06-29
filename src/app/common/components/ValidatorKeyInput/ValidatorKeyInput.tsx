import React from 'react';
import { observer } from 'mobx-react';
import Link from '@material-ui/core/Link';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useStyles } from './ValidatorKeyInput.styles';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';

type ValidatorPrivateKeyInputProps = {
  validatorKey: string,
};

const ValidatorKeyInput = (props: ValidatorPrivateKeyInputProps) => {
  const classes = useStyles();
  const { validatorKey } = props;
  const beaconchaBaseUrl = getBaseBeaconchaUrl();
  return (
    <OutlinedInput
      className={classes.wideWidthInput}
      data-testid="validator-private-key-slashing-input"
      type="text"
      inputProps={{ className: classes.input }}
      value={validatorKey}
      endAdornment={(
        <Link href={`${beaconchaBaseUrl}/validator/${validatorKey}`} target="_blank">
          <InputAdornment position="end" className={classes.inputAddonContainer}>
            <img src="/images/external_link.svg" alt="Beaconcha.in" className={classes.inputAddonImage} />
          </InputAdornment>
        </Link>
      )}
      labelWidth={0}
      readOnly
    />
  );
};

export default observer(ValidatorKeyInput);
