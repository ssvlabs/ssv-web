import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useStyles } from './Confirmation.styles';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import DataSection from '~app/common/components/DataSection';
import BackNavigation from '~app/common/components/BackNavigation';

const UnderLine = styled.div`
  display: flex;
  width: 100%;
  border-bottom: solid 1px #efefef;
  margin-bottom: 10px;
`;

const ConfirmationScreen = () => {
    const classes = useStyles();

    return (
      <Paper className={classes.mainContainer}>
        <BackNavigation to={config.routes.OPERATOR.START} text="Register Operator" />
        <Header title={translations.OPERATOR.CONFIRMATION.TITLE} subtitle={translations.OPERATOR.CONFIRMATION.DESCRIPTION} />
        <Grid container direction="column" justify="center" alignItems="center">
          <DataSection withTitle title={'Operator'}>
            <p>name</p>
            <p>guy</p>
          </DataSection>
          <DataSection withTitle={false}>
            <p>key</p>
            <p>0xjkasbdhjakh3jkehajkha2jkeha2kjeha2ek</p>
          </DataSection>
          <UnderLine />
          <DataSection withTitle title={'Est. Transaction Cost'}>
            <p>Transaction fee</p>
            <p>0.0013ETH <strong>$2.15</strong></p>
          </DataSection>
          <DataSection withTitle={false}>
            <p><strong>Total</strong></p>
            <p><strong>$2.15</strong></p>
          </DataSection>
          <UnderLine />
        </Grid>
      </Paper>
    );
};

export default observer(ConfirmationScreen);
