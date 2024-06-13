import { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config, { translations } from '~app/common/config';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper.styles';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice.ts';
import { initMetadata } from '~app/redux/operatorMetadata.slice.ts';

type Props = {
  header: string;
  mainFlow?: boolean;
};

const OperatorsFlow = (props: Props) => {
  const navigate = useNavigate();
  const { header, mainFlow } = props;
  const settingsRef = useRef<HTMLDivElement>(null);
  const classes = useStyles({ mainFlow });
  const operator = useAppSelector(getSelectedOperator)!;
  const dispatch = useAppDispatch();

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    /**
     * Close menu drop down when click outside
     */
    const handleClickOutside = (e: MouseEvent) => {
      if (showSettings && settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsRef, showSettings]);

  const moveToRemoveOperator = () => navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.REMOVE.ROOT);
  const moveToMetaData = async () => {
    dispatch(initMetadata(operator));
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.META_DATA);
  };

  const onNavigationClicked = async () => {
    navigate(-1);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(operator?.id.toString() ?? '');
    dispatch(
      setMessageAndSeverity({
        message: 'Copied to clipboard.',
        severity: 'success'
      })
    );
  };

  const goToAccessSettings = () => navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.ROOT);

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator'
    });
    window.open(`${config.links.EXPLORER_URL}/operators/${operator?.id}`, '_blank');
  };

  const secondaryFlowDom = () => {
    return (
      <Grid container item className={classes.SecondaryHeaderWrapper}>
        <Grid item className={classes.BackNavigation} onClick={onNavigationClicked} />
        <Grid item>
          <Typography className={classes.HeaderText}>{header}</Typography>
        </Grid>
        <Grid item className={classes.Line} />
        <Grid item container xs style={{ gap: 8, alignItems: 'center' }}>
          <Grid item>
            <Typography className={classes.subHeaderText}>ID: {operator?.id}</Typography>
          </Grid>
          <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
          <ImageDiv onClick={openExplorer} image={'explorer'} width={23} height={23} />
        </Grid>
      </Grid>
    );
  };

  const mainFlowDom = () => {
    return (
      <Grid container item xs={11} style={{ alignItems: 'center', textAlign: 'center' }}>
        <Grid item className={classes.BackNavigation} style={{ marginRight: 16 }} onClick={onNavigationClicked} />
        <Grid item className={classes.HeaderText}>
          {header}
        </Grid>
        {/*<Grid item className={classes.CompleteProfile}>*/}
        {/*  Complete your operator profile to increase discoverability and attract more stakers.*/}
        {/*  <LinkText text={'Fill Details'}/>*/}
        {/*</Grid>*/}
      </Grid>
    );
  };

  return (
    <Grid container item>
      {mainFlow ? mainFlowDom() : secondaryFlowDom()}
      {mainFlow && (
        <Grid container item xs style={{ justifyContent: 'flex-end' }}>
          <Grid
            item
            className={classes.Options}
            onClick={() => {
              setShowSettings(!showSettings);
            }}
          />
          {showSettings && (
            <Grid item className={classes.SettingsWrapper}>
              <Grid ref={settingsRef} container item className={classes.Settings}>
                <Grid container item className={classes.Button} onClick={goToAccessSettings}>
                  <Grid className={classes.SettingsImage} />
                  <Typography>{translations.OPERATOR_WHITELIST_ADDRESS.TITLE}</Typography>
                </Grid>
                <Grid container item className={classes.Button} onClick={moveToMetaData}>
                  <Grid className={classes.MetadataImage} />
                  <Typography>Edit Details</Typography>
                </Grid>
                <Grid container item className={classes.Button} onClick={moveToRemoveOperator}>
                  <Grid className={classes.RemoveImage} />
                  <Typography>Remove Operator</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default OperatorsFlow;
