import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import { useStyles } from './ConfirmOperatorsChange.styles';

const ConfirmOperatorsChange = () => {
    const classes = useStyles();

    // @ts-ignore
    const { public_key } = useParams();

    return (
      <Grid container className={classes.Wrapper}>
        <WhiteWrapper header={'Update Operators for Validator'}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>{public_key}</Typography>
            <ImageDiv image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
            <ImageDiv image={'beacon'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>
      </Grid>
    );
};

export default observer(ConfirmOperatorsChange);