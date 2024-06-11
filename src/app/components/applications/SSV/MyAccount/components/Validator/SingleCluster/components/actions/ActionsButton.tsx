import { LuLogOut, LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { SecondaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import { ProcessStore } from '~app/common/stores/applications/SsvWeb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~app/components/ui/dropdown-menu';
import { Tooltip } from '~app/components/ui/tooltip';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import { BULK_FLOWS, SingleCluster } from '~app/model/processes.model';
import { getSelectedCluster } from '~app/redux/account.slice';

const ActionsButton = () => {
  const cluster = useAppSelector(getSelectedCluster);

  const navigate = useNavigate();
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;

  const goToBulkActions = (bulkFlow: BULK_FLOWS) => {
    process.currentBulkFlow = bulkFlow;
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SecondaryButton text={'Actions'} onClick={() => ''} icon={'/images/arrowDown/arrow.svg'} size={ButtonSize.SM} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => goToBulkActions(BULK_FLOWS.BULK_REMOVE)}>
          <LuTrash2 className="size-4" />
          <span>Remove Validators</span>
        </DropdownMenuItem>
        <Tooltip
          side="bottom"
          delayDuration={350}
          content={cluster.isLiquidated ? 'You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed.' : undefined}
        >
          <DropdownMenuItem disabled={cluster.isLiquidated} onSelect={() => goToBulkActions(BULK_FLOWS.BULK_EXIT)}>
            <LuLogOut className="size-4" />
            <span>Exit Validators</span>
          </DropdownMenuItem>
        </Tooltip>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsButton;
