import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { Link as RouterLink } from 'react-router-dom';
import { getImage } from '~lib/utils/filePath';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import UnStyledLink from '~app/common/components/UnStyledLink';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import LinkButton from '~app/common/components/LinkButton/LinkButton';

const RouteLink = UnStyledLink(RouterLink);

const Welcome = () => {
  const classes = useStyles();
  return (
    <Screen title={translations.HOME.TITLE}
      subTitle={translations.HOME.DESCRIPTION}
      body={(
        <Grid container spacing={0} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <RouteLink to={config.routes.VALIDATOR.HOME} data-testid={config.routes.VALIDATOR.HOME}>
              <LinkButton primaryLabel={'Run validator'} secondaryLabel={''} icon={getImage('run_validator_icon.svg')} />
            </RouteLink>
          </Grid>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <RouteLink to={config.routes.OPERATOR.HOME} data-testid={config.routes.OPERATOR.HOME}>
              <LinkButton primaryLabel={'Join as operator'} secondaryLabel={''} icon={getImage('join_as_operator_icon.svg')} />
            </RouteLink>
          </Grid>
        </Grid>
      )}
    />
  );
};

export default observer(Welcome);
