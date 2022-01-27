import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import BackNavigation from '~app/common/components/BackNavigation';
import { useStyles } from './BorderScreen.styles';

type Props = {
    body: any,
    bottom?: any,
    header?: string,
    wrapperClass?: any,
    sectionClass?: any,
    blackHeader?: boolean,
    navigationLink?: string,
    navigationText?: string,
    withConversion?: boolean,
    withoutNavigation?: boolean,
};

const BorderScreen = (props: Props) => {
    const classes = useStyles();
    const { wrapperClass, navigationLink, withoutNavigation, navigationText, blackHeader, header, withConversion, body, sectionClass, bottom } = props;
    const [currency, setCurrency] = useState('SSV');
    const [coins] = useState(['SSV', 'USD']);

    const switchCurrency = (selectedCurrency: string) => {
        setCurrency(selectedCurrency);
    };

    return (
      <Grid container className={`${classes.BorderScreenWrapper} ${wrapperClass || ''}`}>
        {!withoutNavigation && (
          <Grid item className={classes.LinkWrapper}>
            {navigationLink && <BackNavigation to={navigationLink} text={navigationText} />}
          </Grid>
          )}
        <Grid item container className={classes.ScreenWrapper}>
          {(header || withConversion) && (
            <Grid container item className={classes.HeaderSection}>
              <Grid item className={`${classes.Header} ${blackHeader ? classes.BlackHeader : ''}`}>
                {header}
              </Grid>
              {withConversion && process.env.REACT_APP_NEW_STAGE && (
              <Grid item xs={5}>
                <Grid container item className={classes.Conversion}>
                  {coins.map((coin: string, index: number) => {
                        return (
                          <Grid key={index} item xs={6}
                            className={`${classes.Currency} ${currency === coin && classes.SelectedCurrency}`}
                            onClick={() => { switchCurrency(coin); }}>{coin}</Grid>
                        );
                    })}
                </Grid>
              </Grid>
              )}
            </Grid>
          )}
          {body.map((section: any, index: number) => {
            return (
              <Grid key={index} item container style={{ borderBottom: body.length === 1 ? 'none' : '' }} className={sectionClass ?? classes.Section}>
                {section}
              </Grid>
            );
          })}
          {bottom && (
          <Grid item container className={classes.Section}>
            {bottom}
          </Grid>
          )}
        </Grid>
      </Grid>
    );
};

export default BorderScreen;
