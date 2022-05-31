import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import { useStyles } from './ValidatorDropDownMenu.styles';
import NameAndAddress from '~app/components/common/NameAndAddress';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';

type Props = {
    index: number,
    validator: any,
};

const ValidatorDropDownMenu = (props: Props) => {
    const { index, validator } = props;
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const [dropMenu, setDropMenu] = useState(false);
    const totalOperatorsFee = formatNumberToUi(ssvStore.newGetFeeForYear(validator.operators?.reduce(
        (previousValue: number, currentValue: IOperator) => previousValue + walletStore.fromWei(currentValue.fee),
        0,
    )));

    return (
      <Grid container item className={classes.DropDownWrapper} onClick={() => { setDropMenu(!dropMenu); }}>
        <Grid item className={`${classes.ArrowDown} ${dropMenu ? classes.ArrowUp : ''}`}>
          <img src={getImage('arrow_up_icon.svg')} />
        </Grid>
        <Grid item>
          <NameAndAddress address={`0x${longStringShorten(validator.public_key.replace('0x', ''), 4)}`} name={`Validator ${index + 1}`} />
        </Grid>
        <Grid item xs>
          <SsvAndSubTitle ssv={totalOperatorsFee} subText={'/year'} />
        </Grid>
        {dropMenu && (
        <Grid container item xs={12} className={classes.OperatorsWrapper}>
          {validator.operators.map((operator: any, operatorIndex: number) => {
                        return (
                          <Grid key={operatorIndex} item container xs={12} className={classes.OperatorWrapper}>
                            <Grid item>
                              <NameAndAddress
                                name={operator.name}
                                address={`0x${longStringShorten(operator.address, 4)}`}
                              />
                            </Grid>
                            <Grid item xs>
                              <SsvAndSubTitle ssv={formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))} subText={'/year'} />
                            </Grid>
                          </Grid>
                        );
          })}
        </Grid>
        )}
      </Grid>
    );
};

export default observer(ValidatorDropDownMenu);