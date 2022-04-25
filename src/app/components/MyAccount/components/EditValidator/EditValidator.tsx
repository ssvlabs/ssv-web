import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/common/components/ImageDiv';
import WhiteWrapper from '~app/common/components/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import SelectOperators from '~app/components/RegisterValidatorHome/components/SelectOperators';
import { useStyles } from './EditValidator.styles';

const EditValidator = () => {
    const stores = useStores();
    const classes = useStyles();
    // @ts-ignore
    const { public_key } = useParams();
    const applicationStore: ApplicationStore = stores.Application;
    const operatorStore: OperatorStore = stores.Operator;

    useEffect(() => {
        applicationStore.setIsLoading(true);
        Validator.getInstance().getValidator(public_key).then((response: any) => {
            if (response) {
                operatorStore.selectOperators(response?.operators);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    return (
      <Grid container className={classes.EditValidatorWrapper}>
        <WhiteWrapper header={'Update Operators for Validator'}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>{public_key}</Typography>
            <ImageDiv image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
            <ImageDiv image={'beacon'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>
        <SelectOperators editPage />
      </Grid>
    );
};
export default observer(EditValidator);