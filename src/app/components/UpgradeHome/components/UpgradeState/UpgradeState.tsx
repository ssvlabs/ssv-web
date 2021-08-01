import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Header from '~app/common/components/Header';
import BackNavigation from '~app/common/components/BackNavigation';
import { useStyles } from '~app/components/UpgradeHome/components/UpgradeState/UpgradeState.styles';

type UpgradeStateProps = {
  title: string,
  subTitle: string,
  navigationText?: string
  navigationOnClick?: any
  navigationLink?: string
  body?: any;
  actionButton?: any;
  align?: boolean;
  styleOptions?: Style;
  hideTopIcons?: boolean;
  headerStyle?: any;
};

type Style = {
  actionButtonMarginTop?: string
  bodyMarginTop?: string
};

const defaultStyle = {
  body: {
    marginTop: '24px',
  },
  button: {
    marginTop: '102px',
    marginBottom: '54px',
  },
};

const UpgradeState = (upgradeStateProps: UpgradeStateProps) => {
  const {
    title, subTitle, navigationLink, navigationOnClick,
    navigationText, body, styleOptions, hideTopIcons,
    headerStyle,
  } = upgradeStateProps;
  const classes = useStyles();

  return (
    <Grid container spacing={0} justify="center" className={classes.root}>
      <Grid item xs={12} md={12}>
        {(navigationLink || navigationOnClick) && (
          <BackNavigation
            to={navigationLink ?? null}
            text={navigationText}
            onClick={navigationOnClick}
          />
        )}
      </Grid>

      {!hideTopIcons ? <img src="/images/upgrade.svg" /> : ''}

      <Grid item xs={12} md={12} className={`${classes.header}`} style={headerStyle ?? {}}>
        <Header title={title} subtitle={subTitle} />
      </Grid>

      <Grid item xs={12} md={12} className={classes.body} style={{ marginTop: styleOptions?.bodyMarginTop ?? defaultStyle.body.marginTop }}>
        {body}
      </Grid>
    </Grid>
  );
};

export default observer(UpgradeState);
