import Grid from '@mui/material/Grid';
import TableRow from '@mui/material/TableRow';
import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useAccount } from 'wagmi';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare.styles';
import MevCounterBadge from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevCounterBadge';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import StyledCell from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledCell';
import Checkbox from '~app/components/common/CheckBox';
import Status from '~app/components/common/Status';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip';
import { useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { getOperatorValidatorsLimit } from '~app/redux/operator.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { formatNumberToUi, roundNumber } from '~lib/utils/numbers';
import { canAccountUseOperator } from '~lib/utils/operatorMetadataHelper';
import { cn } from '~lib/utils/tailwind';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';

type Props = {
  operator: IOperator;
  isSelected: boolean;
  onClick: (operator: IOperator) => void;
};

export const OperatorRow: FC<Props> = ({ operator, isSelected, onClick }) => {
  const account = useAccount();
  const classes = useStyles({ loading: true });

  const operatorValidatorsLimit = useAppSelector(getOperatorValidatorsLimit);
  const reachedMaxValidators = operatorValidatorsLimit <= operator.validators_count;
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
    <AnchorTooltip title={'Operator reached maximum amount of validators'} placement={'top'} dontUseGridWrapper shouldDisableHoverListener={!reachedMaxValidators}>
      <TableRow
        className={cn(classes.RowWrapper, {
          [classes.Selected]: isSelected,
          [classes.RowDisabled]: isDisabled
        })}
        onClick={() => {
          if (!isDisabled) {
            onClick(operator);
          }
        }}
      >
        <StyledCell style={{ paddingLeft: 20, width: 60, paddingTop: 35 }}>
          <Checkbox isDisabled={isDisabled} grayBackGround text={''} isChecked={isSelected} toggleIsChecked={() => {}} />
        </StyledCell>
        <StyledCell>
          <OperatorDetails nameFontSize={14} idFontSize={12} logoSize={24} withoutExplorer operator={operator} />
        </StyledCell>
        <StyledCell>
          <Grid container>
            <Grid item>{operator.validators_count}</Grid>
          </Grid>
        </StyledCell>
        <StyledCell>
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
        </StyledCell>
        <StyledCell>
          <Grid container>
            <Grid item className={classes.FeeColumn}>
              {formatNumberToUi(getFeeForYear(fromWei(operator.fee)))} SSV
            </Grid>
          </Grid>
        </StyledCell>
        <StyledCell>
          <Grid container>
            <MevCounterBadge mevRelaysList={mevRelays.split(',')} mevCount={mevRelaysCount} />
          </Grid>
        </StyledCell>
        <StyledCell>
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
        </StyledCell>
      </TableRow>
    </AnchorTooltip>
  );
};

OperatorRow.displayName = 'OperatorRow';
