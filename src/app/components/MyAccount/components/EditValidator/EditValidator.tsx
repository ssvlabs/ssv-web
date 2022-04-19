import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ImageDiv from '~app/common/components/ImageDiv';
import WhiteWrapper from '~app/common/components/WhiteWrapper';
import { useStyles } from './EditValidator.styles';
import SelectOperators from '~app/components/RegisterValidatorHome/components/SelectOperators';

const EditValidator = () => {
    const classes = useStyles();
    return (
      <Grid container className={classes.EditValidatorWrapper}>
        <WhiteWrapper header={'Update Operators for Validator'}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>0xb51054368d9d907bdcabcd8b4e2d3475e50b0d528b78eaab39e9a6e3db71d0ffd5e6508c9ab286426893d3ccaca142b7</Typography>
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