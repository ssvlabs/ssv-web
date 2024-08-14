import Grid from '@mui/material/Grid';
import { ReactElement, useState } from 'react';
import BackNavigation from '~app/components/common/BackNavigation';
import { useStyles } from './BorderScreen.styles';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import styled from 'styled-components';

const NavigationWrapper = styled.div<{ isColored: boolean; marginBottom?: number; headerMarginTop?: number | string; navigatorHeight?: number }>`
  width: 100%;
  background-color: ${({ theme, isColored }) => (isColored ? theme.colors.gray0 : 'transparent')};
  height: ${({ navigatorHeight }) => `${navigatorHeight}px` || `auto`};
  margin-top: ${({ headerMarginTop }) => headerMarginTop || `24px`};
  margin-bottom: ${({ marginBottom }) => `${marginBottom}px` || '24px'};
  display: flex;
  align-items: center;
`;

const TextWrapper = styled.div<{ width: string | number | undefined }>`
  width: ${({ width }) => (width ? `${width}px` : '648px')};
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
`;

type Props = {
  body?: any;
  bottom?: any;
  header?: string;
  backButtonBottomMargin?: number;
  SideHeader?: any;
  gray80?: boolean;
  overFlow?: string;
  marginTop?: number;
  wrapperClass?: any;
  navigatorHeight?: number;
  sectionClass?: any;
  tooltipText?: string | false;
  blackHeader?: boolean;
  headerMarginTop?: number | string;
  borderRadius?: string;
  bottomWrapper?: string;
  wrapperHeight?: number;
  subHeaderText?: string;
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
    headerMarginTop,
    sectionClass,
    bottomWrapper,
    withConversion,
    withoutNavigation,
    backButtonBottomMargin,
    withoutBorderBottom = false,
    wrapperHeight,
    tooltipText,
    subHeaderText = undefined,
    sideElement,
    sideElementShowCondition = true,
    navigatorHeight,
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
    <div>
      {!withoutNavigation && (
        <NavigationWrapper marginBottom={backButtonBottomMargin} navigatorHeight={navigatorHeight} headerMarginTop={headerMarginTop} isColored={!!subHeaderText}>
          <TextWrapper width={width}>
            <BackNavigation onClick={props.onBackButtonClick} text={subHeaderText} />
          </TextWrapper>
        </NavigationWrapper>
      )}
      <Grid container className={`${classes.BorderScreenWrapper} ${wrapperClass || ''}`}>
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
    </div>
  );
};

export default BorderScreen;
