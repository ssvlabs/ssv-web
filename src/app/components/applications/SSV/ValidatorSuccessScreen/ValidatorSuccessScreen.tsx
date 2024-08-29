import { useRef, useState } from 'react';
import { Grid } from '~app/atomicComponents';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config, { translations } from '~app/common/config';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import LinkText from '~app/components/common/LinkText/LinkText';
import { longStringShorten, truncateText } from '~lib/utils/strings';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import OperatorCard from '~app/components/common/OperatorCard/OperatorCard';
import { useStyles } from '~app/components/applications/SSV/ValidatorSuccessScreen/ValidatorSuccessScreen.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getClusterHash } from '~root/services/cluster.service';
import { getAccountAddress } from '~app/redux/wallet.slice';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';
import { getSelectedOperators } from '~app/redux/operator.slice.ts';
import styled from 'styled-components';

const OperatorImage = styled.div<{ logo?: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
  background-image: ${({ logo }) => `url(${logo || '/images/operator_default_background/circle_light.png'})`};
`;

const ValidatorSuccessScreen = () => {
  const [hoveredGrid, setHoveredGrid] = useState<string | null>(null);
  const accountAddress = useAppSelector(getAccountAddress);
  const timeoutRef = useRef<any>(null);
  const classes = useStyles();
  const navigate = useNavigate();
  const buttonText = 'Manage Cluster';
  const selectedOperators = useAppSelector(getSelectedOperators);
  const operators = Object.values(selectedOperators);
  const clusterHash = getClusterHash(operators, accountAddress);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
    }, 5000);

    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'validator'
    });
  };

  const handleGridHover = (index: string) => {
    timeoutRef.current = setTimeout(() => {
      setHoveredGrid(index);
    }, 300);
  };

  const handleGridLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setHoveredGrid(null);
    }
  };

  return (
    <>
      <BorderScreen
        blackHeader
        withoutNavigation
        header={translations.SUCCESS.TITLE}
        sectionClass={classes.Section}
        body={[
          <Grid item container className={classes.Wrapper}>
            <Grid item className={classes.Text}>
              Your new validator is managed by the following cluster:
            </Grid>
            <Grid container item className={classes.ClusterID}>
              <Typography>Validator Cluster {longStringShorten(clusterHash, 4, undefined, { '': /^0x/ })}</Typography>
              {/* need to add link to "read more on clusters" */}
              <Tooltip
                text={
                  <Grid>
                    Clusters represent a unique set of operators who operate your validators. <LinkText text={'Read more on clusters'} link={config.links.MORE_ON_CLUSTERS} />
                  </Grid>
                }
              />
            </Grid>
            <Grid container item style={{ gap: 24, alignItems: 'flex-start' }}>
              {operators.map((operator: any, index: number) => {
                return (
                  <Grid container item className={classes.Operator} key={index}>
                    <Grid item container onMouseLeave={handleGridLeave} className={classes.CircleImageOperatorWrapper} onMouseEnter={() => handleGridHover(operator.id)}>
                      {hoveredGrid === operator.id && <OperatorCard classExtend={index === 0 && classes.OperatorCardMargin} operator={operator} />}
                      <OperatorImage logo={operator.logo} />
                    </Grid>
                    <Grid container className={classes.OperatorData}>
                      <Grid item className={classes.OperatorName} xs>
                        {truncateText(operator.name, 12)}
                      </Grid>
                      <Grid item className={classes.OperatorId}>
                        ID: {operator.id}
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
            <Grid item className={classes.Text}>
              Your cluster operators have been notified and will start your validator operation instantly.
            </Grid>
            <PrimaryButton text={buttonText} onClick={redirectTo} size={ButtonSize.XL} isLoading={isLoading} />
          </Grid>
        ]}
      />
    </>
  );
};

export default ValidatorSuccessScreen;
