import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { useAccount } from 'wagmi';
import config from '~app/common/config';
import { COLUMN_WIDTHS } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare.styles';
import MevCounterBadge from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevCounterBadge';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import Checkbox from '~app/components/common/CheckBox';
import Status from '~app/components/common/Status';
import { Tooltip } from '~app/components/ui/tooltip';
import { useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { getOperatorValidatorsLimit } from '~app/redux/operator.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { formatNumberToUi, roundNumber } from '~lib/utils/numbers';
import { canAccountUseOperator } from '~lib/utils/operatorMetadataHelper';
import { cn } from '~lib/utils/tailwind';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { getFromLocalStorageByKey } from '~root/providers/localStorage.provider.ts';
import { SKIP_VALIDATION } from '~lib/utils/developerHelper.ts';

type Props = {
  operator: IOperator;
  isSelected: boolean;
  onClick: (operator: IOperator) => void;
};

export const OperatorRow = forwardRef<HTMLTableRowElement, ComponentPropsWithRef<'tr'> & Props>(({ operator, isSelected, onClick, ...props }, ref) => {
  const account = useAccount();
  const classes = useStyles({ loading: true });

  const operatorValidatorsLimit = useAppSelector(getOperatorValidatorsLimit);
  const reachedMaxValidators = operatorValidatorsLimit <= operator.validators_count && !getFromLocalStorageByKey(SKIP_VALIDATION);
  const hasValidators = operator.validators_count !== 0;
  const isInactive = operator.is_active < 1;
  const mevRelays = operator?.mev_relays || '';
  const mevRelaysCount = mevRelays ? mevRelays.split(',').filter((item: string) => item).length : 0;

  const canUseOperator = useQuery({
    queryKey: ['can-account-use-operator', operator, account.address],
    queryFn: () => canAccountUseOperator(account.address!, operator)
  });

  const isPrivateOperator = !canUseOperator.data;
  const isDisabled = operator.is_deleted || isPrivateOperator || reachedMaxValidators;

  return (
    // <AnchorTooltip title={'Operator reached maximum amount of validators'} placement={'top'} dontUseGridWrapper shouldDisableHoverListener={!reachedMaxValidators}>
    <Tooltip asChild content={reachedMaxValidators ? 'Operator reached maximum amount of validators' : undefined}>
      <tr
        ref={ref}
        {...props}
        className={cn(
          classes.RowWrapper,
          {
            [classes.Selected]: isSelected,
            [classes.RowDisabled]: isDisabled
          },
          props.className
        )}
        onClick={() => {
          if (!isDisabled) {
            onClick(operator);
          }
        }}
      >
        <td
          className="text-left h-9 p-0 text-base cursor-pointer py-3 px-0 font-medium text-gray-900 border-b border-gray-300"
          style={{ paddingLeft: 20, width: COLUMN_WIDTHS[0], paddingTop: 35 }}
        >
          <Checkbox isDisabled={isDisabled} grayBackGround text={''} isChecked={isSelected} toggleIsChecked={() => {}} />
        </td>
        <td
          className="text-left h-9 p-0 text-base cursor-pointer py-3 px-0 font-medium text-gray-900 border-b border-gray-300"
          style={{ width: COLUMN_WIDTHS[1], minWidth: COLUMN_WIDTHS[1], maxWidth: COLUMN_WIDTHS[1] }}
        >
          <OperatorDetails nameFontSize={14} idFontSize={12} logoSize={24} withoutExplorer operator={operator} />
        </td>
        <td className="text-left h-9 p-0 text-base cursor-pointer py-3 px-0 font-medium text-gray-900 border-b border-gray-300" style={{ width: COLUMN_WIDTHS[2] }}>
          {operator.validators_count}
        </td>
        <td className="text-left h-9 p-0 text-base cursor-pointer py-3 px-0 font-medium text-gray-900 border-b border-gray-300" style={{ width: COLUMN_WIDTHS[3] }}>
          <Grid container>
            <Grid item className={hasValidators && isInactive ? classes.Inactive : ''}>
              {roundNumber(operator.performance['30d'], 2)}%
            </Grid>
            {isInactive && (
              <Grid item xs={12}>
                <Status item={operator} />
              </Grid>
            )}
          </Grid>
        </td>
        <td className="text-left h-9 p-0 text-base cursor-pointer py-3 px-0 font-medium text-gray-900 border-b border-gray-300" style={{ width: COLUMN_WIDTHS[4] }}>
          <Grid container>
            <Grid item className={classes.FeeColumn}>
              {formatNumberToUi(getFeeForYear(fromWei(operator.fee)))} SSV
            </Grid>
          </Grid>
        </td>
        <td className="text-left h-9 p-0 text-base cursor-pointer py-3 px-0 font-medium text-gray-900 border-b border-gray-300" style={{ width: COLUMN_WIDTHS[5] }}>
          <Grid container>
            <MevCounterBadge mevRelaysList={mevRelays.split(',')} mevCount={mevRelaysCount} />
          </Grid>
        </td>
        <td className="text-left h-9 p-0 text-base cursor-pointer py-3 px-0 font-medium text-gray-900 border-b border-gray-300" style={{ width: COLUMN_WIDTHS[6] }}>
          <Grid
            className={classes.ChartIcon}
            onClick={(ev) => {
              ev.stopPropagation();
              GoogleTagManager.getInstance().sendEvent({
                category: 'explorer_link',
                action: 'click',
                label: 'operator'
              });
              window.open(`${config.links.EXPLORER_URL}/operators/${operator.id}`, '_blank');
            }}
          />
        </td>
      </tr>
    </Tooltip>
  );
});

OperatorRow.displayName = 'OperatorRow';
