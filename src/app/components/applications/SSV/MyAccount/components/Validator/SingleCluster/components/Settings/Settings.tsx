import Grid from '@mui/material/Grid';
import { ExternalLink } from 'lucide-react';
import { observer } from 'mobx-react';
import { LuLogOut, LuTrash2 } from 'react-icons/lu';
import { TbRefresh } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { BulkActionRouteState } from '~app/Routes';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/Settings/Settings.styles';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '~app/components/ui/dropdown-menu';
import { Tooltip } from '~app/components/ui/tooltip';
import { BULK_FLOWS } from '~app/enums/bulkFlow.enum';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedCluster } from '~app/redux/account.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { getBeaconChainLink } from '~root/providers/networkInfo.provider';

const Settings = ({ validator, withoutSettings }: { validator: any; withoutSettings?: boolean }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const cluster = useAppSelector(getSelectedCluster);

  const openLink = (link: string) => {
    if (link) {
      GoogleTagManager.getInstance().sendEvent({
        category: 'external_link',
        action: 'click',
        label: 'change_operators'
      });
      window.open(link);
    }
  };

  const openBeaconcha = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha'
    });
    window.open(`${getBeaconChainLink()}/validator/${publicKey}`);
  };

  const openExplorer = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator'
    });
    window.open(`${config.links.EXPLORER_URL}/validators/${publicKey}`, '_blank');
  };

  const moveToRemoveValidator = (flow: BULK_FLOWS) => {
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK, { state: { validator, currentBulkFlow: flow } satisfies BulkActionRouteState });
  };

  return (
    <Grid container className={classes.ExtraButtonsWrapper}>
      <ImageDiv onClick={() => openBeaconcha(validator.public_key)} image={'beacon'} width={24} height={24} />
      <ImageDiv onClick={() => openExplorer(validator.public_key)} image={'explorer'} width={24} height={24} />
      {!withoutSettings && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ImageDiv image={'setting'} width={24} height={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => openLink(config.links.UPDATE_OPERATORS_LINK)}>
              <TbRefresh className="size-4" />
              <span>Change operator</span>
              <DropdownMenuShortcut>
                <ExternalLink className="size-3" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => moveToRemoveValidator(BULK_FLOWS.BULK_REMOVE)}>
              <LuTrash2 className="size-4" />
              <span>Remove Validator</span>
            </DropdownMenuItem>
            <Tooltip
              side="bottom"
              delayDuration={350}
              content={cluster.isLiquidated ? 'You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed.' : undefined}
            >
              <DropdownMenuItem disabled={cluster.isLiquidated} onSelect={() => moveToRemoveValidator(BULK_FLOWS.BULK_EXIT)}>
                <LuLogOut className="size-4" />
                <span>Exit Validator</span>
              </DropdownMenuItem>
            </Tooltip>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Grid>
  );
};

export default observer(Settings);
