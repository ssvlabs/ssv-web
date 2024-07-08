import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/components/common/ImageDiv';
import BackNavigation from '~app/components/common/BackNavigation';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/common/WhiteWrapper/WhiteWrapper.styles';
import ValidatorStore from '../../../common/stores/applications/SsvWeb/Validator.store';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';
import { PrimaryButton, SecondaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';

type Props = {
  header: any;
  children: any;
  explorerLink?: any;
  withCancel?: boolean;
  withExplorer?: boolean;
  backButtonCallBack?: any;
  withBackButton?: boolean;
  backButtonRedirect?: string;
  withSettings?: SettingsProps;
};

type SettingsProps = {
  text: string;
  onClick: () => void;
};

const WhiteWrapper = (props: Props) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const { header, children, withExplorer, explorerLink, withCancel, withSettings, backButtonCallBack, backButtonRedirect, withBackButton = true } = props;
  const validatorStore: ValidatorStore = stores.Validator;
  const settingsRef = useRef(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isLoading = useAppSelector(getIsLoading);

  const cancelProcess = () => {
    validatorStore.clearKeyStoreFlowData();
    GoogleTagManager.getInstance().sendEvent({
      category: 'cancel',
      action: 'click'
    });
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT);
  };

  const dialogHandler = () => {
    if (!isLoading) setOpenDialog(!openDialog);
  };

  const ShowSettings = () => {
    if (!showSettings || !withSettings) return null;
    const { text, onClick } = withSettings;
    return (
      <Grid ref={settingsRef} container item className={classes.Settings}>
        <Grid item className={classes.Button} onClick={onClick}>
          {text}
        </Grid>
      </Grid>
    );
  };

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator'
    });
    window.open(`${config.links.EXPLORER_URL}/operators/${explorerLink}`, '_blank');
  };

  useEffect(() => {
    /**
     * Close menu drop down when click outside
     */
    const handleClickOutside = (e: any) => {
      // @ts-ignore
      if (showSettings && settingsRef.current && !settingsRef.current.contains(e.target)) {
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

  return (
    <Grid container item className={classes.WhiteWrapper}>
      <Grid item container className={classes.Wrapper}>
        {header && (
          <Grid container item xs={12} alignItems={'center'}>
            {withBackButton && (
              <Grid item xs={12} className={classes.BackButtonWrapper}>
                <BackNavigation onClick={backButtonCallBack} backButtonRedirect={backButtonRedirect} />
              </Grid>
            )}
            <Grid item container xs className={classes.HeaderWrapper}>
              <Grid item container xs={6} style={{ alignItems: 'center', gap: 11 }}>
                <Typography>{header}</Typography>
                {withExplorer && <ImageDiv onClick={openExplorer} image={'explorer'} width={21} height={21} />}
              </Grid>
              {withCancel && (
                <Grid item xs={6}>
                  <Grid container item className={classes.CancelWrapper}>
                    <Typography onClick={dialogHandler}>Cancel</Typography>
                    <Grid item className={classes.CancelImage} onClick={dialogHandler} />
                  </Grid>
                </Grid>
              )}
            </Grid>
            {withSettings && (
              <Grid item xs={6}>
                <Grid
                  item
                  className={classes.Options}
                  onClick={() => {
                    setShowSettings(!showSettings);
                  }}
                />
                <Grid item className={classes.SettingsWrapper}>
                  <ShowSettings />
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
        <Grid item xs={12} className={classes.ChildWrapper}>
          {children}
        </Grid>
        <Dialog
          open={openDialog}
          PaperProps={{
            style: { borderRadius: 16, backgroundColor: 'transparent' }
          }}
        >
          <Grid container item className={classes.DialogWrapper}>
            <HeaderSubHeader title={'Cancel Update Operators'} subtitle={'Are you sure you want to cancel'} />
            <Grid container className={classes.ButtonsWrapper}>
              <Grid item xs>
                <SecondaryButton text={'Yes, Cancel'} onClick={cancelProcess} size={ButtonSize.XL} />
              </Grid>
              <Grid item xs>
                <PrimaryButton text={'No, Go Back'} onClick={dialogHandler} size={ButtonSize.XL} />
              </Grid>
            </Grid>
          </Grid>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default observer(WhiteWrapper);
