import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import { longStringShorten } from '~lib/utils/strings';
import { useStyles } from './ValidatorDropDownMenu.styles';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import NameAndAddress from '~app/common/components/NameAndAddress';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';

type Props = {
    index: number,
    setTotalFee: any,
    allOperatorsFee: number,
    validatorPublicKey: any,
};

const ValidatorDropDownMenu = (props: Props) => {
    const { index, validatorPublicKey, allOperatorsFee, setTotalFee } = props;
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    // const operatorStore: OperatorStore = stores.Operator;
    const [dropMenu, setDropMenu] = useState(false);
    const [operators, setOperators]: any = useState([]);
    const [validatorTotalFee, setValidatorTotalFee]: any = useState(0);

    useEffect(() => {
        ssvStore.getValidatorOperators(validatorPublicKey).then((operatorsPublicKeys) => {
            const validatorOperators: any = [];
            const totalFee: number = 0;
            operatorsPublicKeys.forEach((publicKey: string) => {
                const operator = publicKey;
                if (operator) {
                    // if (operator.fee != null) {
                    //     totalFee += ssvStore.getFeeForYear(operator.fee);
                    // }
                    validatorOperators.push(operator);   
                }
            });
            setOperators(validatorOperators);
            setTotalFee(totalFee + allOperatorsFee);
            setValidatorTotalFee(totalFee);
        });
    }, [validatorPublicKey]);

    return (
      <Grid className={classes.DropDownWrapper} item container onClick={() => {
            setDropMenu(!dropMenu);
        }}>
        <Grid item className={`${classes.ArrowDown} ${dropMenu ? classes.ArrowUp : ''}`}><img
          src={getImage('arrow_up_icon.svg')} /></Grid>
        <Grid item><NameAndAddress address={`0x${longStringShorten(validatorPublicKey.replace('0x', ''), 4)}`} name={`Validator ${index + 1}`} /></Grid>
        <Grid item xs><SsvAndSubTitle ssv={validatorTotalFee} subText={'/year'} /></Grid>
        {dropMenu && (
        <Grid container item xs={12} className={classes.OperatorsWrapper}>
          {operators.map((operator: any, operatorIndex: number) => {
                        return (
                          <Grid key={operatorIndex} item container xs={12} className={classes.OperatorWrapper}>
                            <Grid item>
                              <NameAndAddress
                                address={`0x${longStringShorten(sha256(walletStore.decodeKey(operator.pubkey)), 4)}`}
                                name={operator.name}
                              />
                            </Grid>
                            <Grid item xs>
                              <SsvAndSubTitle ssv={ssvStore.getFeeForYear(operator.fee)} subText={'/year'} />
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