import Grid from '@mui/material/Grid';
import { ReactElement, useState } from 'react';
import BackNavigation from '~app/components/common/BackNavigation';
import { useStyles } from './BorderScreen.styles';
import Tooltip from '~app/components/common/ToolTip/ToolTip';

type Props = {
  body?: any;
  bottom?: any;
  header?: string;
  SideHeader?: any;
  gray80?: boolean;
  overFlow?: string;
  marginTop?: number;
  wrapperClass?: any;
  sectionClass?: any;
  tooltipText?: string | false;
  blackHeader?: boolean;
  borderRadius?: string;
  bottomWrapper?: string;
  wrapperHeight?: number;
  width?: number | string;
  withConversion?: boolean;
  sideElement?: ReactElement;
  withoutNavigation?: boolean;
  withoutBorderBottom?: boolean;
  sideElementShowCondition?: boolean;
  onBackButtonClick?: () => void | null | undefined;
  children?: React.ReactNode;
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
    tooltipText,
    sideElement,
    sideElementShowCondition = true,
    children
  } = props;
  const classes = useStyles({
    overFlow,
    gray80,
    blackHeader,
    marginTop,
    width,
    wrapperHeight
  });

  const switchCurrency = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
  };

  return (
    <Grid container className={`${classes.BorderScreenWrapper} ${wrapperClass || ''}`}>
      {!withoutNavigation && (
        <Grid item className={classes.LinkWrapper}>
          <BackNavigation onClick={props.onBackButtonClick} />
        </Grid>
      )}
      {children ? (
        children
      ) : (
        <Grid item container className={classes.ScreenWrapper} style={{ borderRadius }}>
          {(header || withConversion) && (
            <Grid container item className={classes.HeaderSection} justifyContent={'space-between'}>
              <Grid item className={classes.Header} xs>
                {header}
                {tooltipText && <Tooltip text={tooltipText} />}
              </Grid>
              {SideHeader && !withConversion && (
                <Grid item>
                  <SideHeader />
                </Grid>
              )}
              {withConversion && false && (
                <Grid item>
                  <Grid container item className={classes.Conversion}>
                    {coins.map((coin: string, index: number) => {
                      return (
                        <Grid
                          key={index}
                          item
                          xs={6}
                          className={`${classes.Currency} ${currency === coin && classes.SelectedCurrency}`}
                          onClick={() => {
                            switchCurrency(coin);
                          }}
                        >
                          {coin}
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              )}
              {sideElement && sideElementShowCondition && sideElement}
            </Grid>
          )}

          {body.map((section: any, index: number) => {
            return (
              <Grid key={index} item container style={{ borderBottom: body.length === 1 || withoutBorderBottom ? 'none' : '' }} className={sectionClass ?? classes.Section}>
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
      )}
    </Grid>
  );
};

export default BorderScreen;
