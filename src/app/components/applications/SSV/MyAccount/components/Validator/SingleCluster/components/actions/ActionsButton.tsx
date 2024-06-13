import { LuLogOut, LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { SecondaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~app/components/ui/dropdown-menu';
import { Tooltip } from '~app/components/ui/tooltip';
import { ButtonSize } from '~app/enums/Button.enum';
import { BULK_FLOWS } from '~app/enums/bulkFlow.enum.ts';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedCluster } from '~app/redux/account.slice';

const ActionsButton = () => {
  const cluster = useAppSelector(getSelectedCluster);
  const navigate = useNavigate();

  const goToBulkActions = (bulkFlow: BULK_FLOWS) => {
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK, { state: { currentBulkFlow: bulkFlow } });
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
