import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import BackNavigation from '~app/common/components/BackNavigation';
import { useStyles } from './BorderScreen.styles';

type Navigation = {
    to: string,
    text: string,
};

type Props = {
    link: Navigation,
    body: any,
    bottom: any,
    header: string,
    headerChildren?: any,
    withConversion: boolean,
};

const BorderScreen = (props: Props) => {
    const classes = useStyles();
    const { headerChildren, link, header, withConversion, body, bottom } = props;
    const [currency, setCurrency] = useState('SSV');
    const [coins] = useState(['SSV', 'USD']);

    const switchCurrency = (selectedCurrency: string) => {
        console.log(headerChildren);
        setCurrency(selectedCurrency);
    };

    return (
      <Grid container className={classes.BorderScreenWrapper}>
        <Grid item className={classes.LinkWrapper}>
          <BackNavigation to={link.to} text={link.text} />
        </Grid>
        <Grid item container className={classes.ScreenWrapper}>
          <Grid container item className={classes.Section}>
            <Grid item xs={6} className={classes.Header}>
              {header}
            </Grid>
            {withConversion && (
            <Grid item xs={6}>
              <Grid container item className={classes.Conversion}>
                {coins.map((coin: string, index: number) => {
                            return <Grid key={index} item xs={6} className={`${classes.Currency} ${currency === coin && classes.SelectedCurrency}`} onClick={() => { switchCurrency(coin); }}>{coin}</Grid>;
                })}
              </Grid>
            </Grid>
            )}
          </Grid>
          {body.map((section: any) => {
            return (
              <Grid item container className={classes.Section}>
                {section}
              </Grid>
            );
          })}
          <Grid container item>
            {bottom && bottom}
          </Grid>
        </Grid>
      </Grid>
    );
};

export default BorderScreen;
