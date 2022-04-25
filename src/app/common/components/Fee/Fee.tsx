import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/common/components/Fee/Fee.styles';

type Props = {
    publicKey: string
    className: string
};
const Fee = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const [fee, setFee] = useState(0);
    const ssvStore: SsvStore = stores.SSV;
    const { publicKey, className } = props;
    const [isLoading, setIsLoading] = useState(true);
    const operatorStore: OperatorStore = stores.Operator;

    useEffect(() => {
        operatorStore.getOperatorFee(publicKey).then((operatorFee: number) => {
            setTimeout(() => {
                try {
                    setFee(ssvStore.getFeeForYear(operatorFee));
                    setIsLoading(false);
                } catch (e: any) {
                    console.log('<<<<<<<<<<<<<<<<<<<<<<1>>>>>>>>>>>>>>>>>>>>>>');
                }
            }, 500);
        });
    }, [publicKey]);

    if (isLoading) {
        return (
          <Grid item xs={12} className={classes.LoaderWrapper}>
            <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
          </Grid>
        );
    }

    return (
      <Grid item xs={12} className={className}>
        {fee} SSV
      </Grid>
    );
};

export default observer(Fee);
