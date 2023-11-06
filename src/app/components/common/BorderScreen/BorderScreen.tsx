import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import BackNavigation from '~app/components/common/BackNavigation';
import { useStyles } from './BorderScreen.styles';

type Props = {
  body: any,
  bottom?: any,
  header?: string,
  SideHeader?: any,
  gray80?: boolean,
  overFlow?: string,
  width?: number | string,
  marginTop?: number,
  wrapperHeight?: number,
  wrapperClass?: any,
  sectionClass?: any,
  blackHeader?: boolean,
  borderRadius?: string,
  bottomWrapper?: string,
  withConversion?: boolean,
  withoutNavigation?: boolean,
  withoutBorderBottom?: boolean,
  onBackButtonClick?: () => void | null | undefined,
};

const BorderScreen = (props: Props) => {
  const [coins] = useState(['SSV', 'USD']);
  const [currency, setCurrency] = useState('SSV');
  const {
    body,
    gray80,
    header,
    bottom,
    overFlow,
    marginTop,
    SideHeader,
    width,
    blackHeader,
    wrapperClass,
    borderRadius,
    sectionClass,
    bottomWrapper,
    withConversion,
    withoutNavigation,
    withoutBorderBottom = false,
    wrapperHeight,
  } = props;
  const classes = useStyles({ overFlow, gray80, blackHeader, marginTop, width, wrapperHeight });

  const switchCurrency = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
  };

  return (
    <Grid container className={`${classes.BorderScreenWrapper} ${wrapperClass || ''}`}>
      {!withoutNavigation && (
        <Grid item className={classes.LinkWrapper}>
          <BackNavigation onClick={props.onBackButtonClick}/>
        </Grid>
      )}
      <Grid item container className={classes.ScreenWrapper} style={{ borderRadius }}>
        {(header || withConversion) && (
          <Grid container item className={classes.HeaderSection} justifyContent={'space-between'}>
            <Grid item className={classes.Header} xs>
              {header}
            </Grid>
            {SideHeader && !withConversion && <Grid item><SideHeader/></Grid>}
            {withConversion && false && (
              <Grid item>
                <Grid container item className={classes.Conversion}>
                  {coins.map((coin: string, index: number) => {
                    return (
                      <Grid key={index} item xs={6}
                            className={`${classes.Currency} ${currency === coin && classes.SelectedCurrency}`}
                            onClick={() => {
                              switchCurrency(coin);
                            }}>{coin}</Grid>
                    );
                  })}
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
        {body.map((section: any, index: number) => {
          return (
            <Grid key={index} item container
                  style={{ borderBottom: body.length === 1 || withoutBorderBottom ? 'none' : '' }}
                  className={sectionClass ?? classes.Section}>
              {section}
            </Grid>
          );
        })}
        {bottom?.map((section: any, index: number) => {
          return (
            <Grid key={index} item container className={bottomWrapper ?? classes.Section}>
              {section}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default BorderScreen;
