import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import { truncateText } from '~lib/utils/strings';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import CustomTooltip from '~app/components/common/ToolTip/ToolTip';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import OperatorType from '~app/components/common/OperatorType/OperatorType';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip/AnchorTooltIp';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails.styles';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { isOperatorPrivate } from '~lib/utils/operatorMetadataHelper';
import { IOperator } from '~app/model/operator.model.ts';
import { Tooltip } from '~app/components/ui/tooltip';

type Props = {
  gray80?: boolean;
  withCopy?: boolean;
  withoutExplorer?: boolean;
  operator: IOperator;
  setOpenExplorerRefs?: Function;
  logoSize?: number;
  nameFontSize?: number;
  idFontSize?: number;
  isFullOperatorName?: boolean;
};

const OperatorDetails = (props: Props) => {
  const { gray80, operator, withCopy, withoutExplorer, setOpenExplorerRefs, logoSize, nameFontSize, idFontSize, isFullOperatorName } = props;
  const classes = useStyles({
    nameFontSize,
    idFontSize,
    logoSize,
    isDeleted: operator.is_deleted,
    operatorLogo: operator.logo,
    gray80
  });
  const operatorName = operator?.name || 'NoName';
  const isPrivateOperator = isOperatorPrivate(operator);
  const dispatch = useAppDispatch();

  const copyId = () => {
    navigator.clipboard.writeText(operator.id.toString());
    dispatch(
      setMessageAndSeverity({
        message: 'Copied to clipboard.',
        severity: 'success'
      })
    );
  };

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator'
    });
    window.open(`${config.links.EXPLORER_URL}/operators/${operator.id}`, '_blank');
  };

  return (
    <Grid container className={classes.Wrapper}>
      <Grid className={classes.OperatorDetailsWrapper}>
        <Grid item className={classes.OperatorLogo}>
          {isPrivateOperator && (
            <Tooltip asChild content={'Private Operator'}>
              <Grid className={classes.PrivateOperatorWrapper}>
                <Grid className={classes.PrivateOperatorLockIcon} />
              </Grid>
            </Tooltip>
          )}
        </Grid>

        <Grid item className={classes.TextWrapper}>
          <Grid item className={classes.Name}>
            {operatorName.length > 18 && !isFullOperatorName ? (
              <AnchorTooltip title={operatorName} placement={'top'}>
                {truncateText(operatorName, 18)}
              </AnchorTooltip>
            ) : (
              operatorName
            )}
          </Grid>
          <Grid item container className={classes.Id}>
            ID: {operator.id}
            {withCopy && <Grid className={classes.Copy} onClick={copyId} />}
          </Grid>
        </Grid>
      </Grid>
      {operator.type !== 'operator' && (
        <Grid item className={classes.OperatorType}>
          <OperatorType type={operator.type} />
        </Grid>
      )}
      {!operator.is_deleted && !withoutExplorer && (
        <Grid item className={classes.OperatorType}>
          <ImageDiv onClick={openExplorer} setOpenExplorerRefs={setOpenExplorerRefs} image={'explorer'} width={20} height={20} />
        </Grid>
      )}
      {operator.is_deleted && (
        <Grid item className={classes.OperatorType}>
          <ImageDiv onClick={openExplorer} image={'operatorOff'} width={20} height={20} />
        </Grid>
      )}
      {operator.is_deleted && (
        <Grid item className={classes.OperatorType}>
          <CustomTooltip text={'This operator has left the network permanently'} />
        </Grid>
      )}
    </Grid>
  );
};

export default OperatorDetails;
