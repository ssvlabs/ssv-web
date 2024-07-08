import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { osName } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CopyButton } from '~app/atomicComponents';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import { validateAddressInput } from '~lib/utils/validatesInputs';
import CustomTooltip from '~app/components/common/ToolTip/ToolTip';
import { isDkgAddressValid } from '~lib/utils/operatorMetadataHelper';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import DkgOperator from '~app/components/applications/SSV/RegisterValidatorHome/components/DkgOperator/DkgOperator';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/OfflineKeyShareGeneration/OfflineKeyShareGeneration.styles';
import Spinner from '~app/components/common/Spinner';
import { ButtonSize } from '~app/enums/Button.enum';
import { OperatingSystemsEnum } from '~app/enums/os.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useOperatorsDKGHealth } from '~app/hooks/useOperatorsDKGHealth';
import { IOperator } from '~app/model/operator.model';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { getSelectedOperators } from '~app/redux/operator.slice.ts';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { cn } from '~lib/utils/tailwind';
import { getOwnerNonce } from '~root/services/account.service';
import { getIsClusterSelected } from '~app/redux/account.slice.ts';

const DkgTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const OsButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const OsButtons = styled.div<{ isSelected: boolean; theme: any }>`
  height: 24px;
  padding: 1px 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ isSelected, theme }) => (isSelected ? theme.colors.primaryBlue : theme.colors.gray60)};
  border-radius: 4px;
  border: ${({ isSelected, theme }) => `1px solid ${isSelected ? theme.colors.primaryBlue : theme.colors.gray30}`};
`;

const OFFLINE_FLOWS = {
  COMMAND_LINE: 1,
  DESKTOP_APP: 2,
  DKG: 3
} as const;

const XS = 12;
const MIN_VALIDATORS_COUNT = 1;
const MAX_VALIDATORS_COUNT = 100;

const OPERATING_SYSTEMS = [
  {
    title: 'Windows',
    systemName: OperatingSystemsEnum.Windows
  },
  {
    title: 'MacOS',
    systemName: OperatingSystemsEnum.MacOS
  },
  {
    title: 'Linux (and WSL)',
    systemName: OperatingSystemsEnum.Linux
  }
];

const OfflineKeyShareGeneration = () => {
  const [selectedBox, setSelectedBox] = useState(0);
  const [textCopied, setTextCopied] = useState(false);
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [addressValidationError, setAddressValidationError] = useState({
    shouldDisplay: true,
    errorMessage: ''
  });
  const [ownerNonce, setOwnerNonce] = useState<number | undefined>(undefined);
  const [confirmedWithdrawalAddress, setConfirmedWithdrawalAddress] = useState(false);
  const [validatorsCount, setValidatorsCount] = useState(MIN_VALIDATORS_COUNT);
  const [isInvalidValidatorsCount, setIsInvalidValidatorsCount] = useState(false);
  const [operatingSystemName, setOperatingSystemName] = useState(osName);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accountAddress = useAppSelector(getAccountAddress);
  const classes = useStyles();
  const selectedOperators = useAppSelector(getSelectedOperators);
  const { apiNetwork } = getStoredNetwork();

  const isEveryOperatorDkgAddressValid = Object.values(selectedOperators).every((operator: IOperator) => isDkgAddressValid(operator.dkg_address ?? ''));

  const operatorsDKGHealth = useOperatorsDKGHealth({
    operators: Object.values(selectedOperators),
    enabled: selectedBox === OFFLINE_FLOWS.DKG
  });

  const operatorsAcceptDkg = isEveryOperatorDkgAddressValid && operatorsDKGHealth.data?.every((o) => o.isHealthy);

  const isWindowOs = operatingSystemName === OperatingSystemsEnum.Windows;
  const dynamicFullPath = isWindowOs ? '%cd%' : '$(pwd)';
  const isSecondRegistration = useAppSelector(getIsClusterSelected);

  useEffect(() => {
    const fetchOwnerNonce = async () => {
      const nonce = await getOwnerNonce({ address: accountAddress });
      // TODO: add proper error handling
      setOwnerNonce(nonce);
    };
    fetchOwnerNonce();
  }, []);

  const confirmWithdrawalAddressHandler = () => {
    if (!addressValidationError.shouldDisplay && withdrawalAddress) {
      setConfirmedWithdrawalAddress(true);
    }
  };

  const isSelected = (id: number) => selectedBox === id;

  const goToNextPage = (selectedBoxIndex: number, isSecondRegistration: boolean) => {
    if (selectedBoxIndex === OFFLINE_FLOWS.DKG) {
      navigate(config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_SUMMARY);
      return;
    }
    if (isSecondRegistration) {
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES);
    } else {
      navigate(config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.UPLOAD_KEYSHARES);
    }
  };

  const goToChangeOperators = () => {
    navigate(-2);
  };

  const sortedOperators = Object.values(selectedOperators).sort((a: any, b: any) => a.id - b.id);
  const { operatorsIds, operatorsKeys } = sortedOperators.reduce(
    (aggr: any, operator: IOperator) => {
      aggr.operatorsIds.push(operator.id);
      aggr.operatorsKeys.push(operator.public_key);
      return aggr;
    },
    {
      operatorsIds: [],
      operatorsKeys: []
    }
  );

  const getOperatorsData = () => {
    const operatorsInfo = Object.values(selectedOperators).map((operator: any) => ({
      id: operator.id,
      public_key: operator.public_key,
      ip: operator.dkg_address
    }));
    let jsonOperatorInfo = JSON.stringify(operatorsInfo);
    if (isWindowOs) {
      jsonOperatorInfo = jsonOperatorInfo.replace(/"/g, '\\"');
    }
    return isWindowOs ? `"${jsonOperatorInfo}"` : `'${jsonOperatorInfo}'`;
  };

  const cliCommandPrefix = isWindowOs ? 'ssv-keys.exe' : './ssv-keys-mac';
  const cliCommand = `${cliCommandPrefix} --operator-keys=${operatorsKeys.join(',')} --operator-ids=${operatorsIds.join(',')} --owner-address=${accountAddress} --owner-nonce=${ownerNonce}`;
  const dkgCliCommand = `docker pull bloxstaking/ssv-dkg:v2.1.0 && docker run --rm -v ${dynamicFullPath}:/data -it "bloxstaking/ssv-dkg:v2.1.0" init --owner ${accountAddress} --nonce ${ownerNonce} --withdrawAddress ${withdrawalAddress} --operatorIDs ${operatorsIds.join(',')} --operatorsInfo ${getOperatorsData()} --network ${apiNetwork} --validators ${validatorsCount} --logFilePath /data/debug.log --outputPath /data`;
  const instructions = [
    {
      id: OFFLINE_FLOWS.COMMAND_LINE,
      instructions: [
        <Grid>
          1. Download the <b>{osName}</b> executable from <LinkText text={translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.linkText} link={config.links.SSV_KEYS_RELEASES_URL} />
        </Grid>,
        translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.COMMAND_LINE_INSTRUCTIONS.secondStep,
        translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.COMMAND_LINE_INSTRUCTIONS.thirdStep,
        translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.COMMAND_LINE_INSTRUCTIONS.fourthStep
      ]
    },
    {
      id: OFFLINE_FLOWS.DESKTOP_APP,
      instructions: [
        <Grid>
          1. Download the <b>{osName}</b> executable from <LinkText text={translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.linkText} link={config.links.SSV_KEYS_RELEASES_URL} />
        </Grid>,
        translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.DESKTOP_APP.secondStep,
        translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.DESKTOP_APP.thirdStep
      ]
    }
  ];

  const copyToClipboard = () => {
    const command = selectedBox === OFFLINE_FLOWS.COMMAND_LINE ? cliCommand : dkgCliCommand;
    navigator.clipboard.writeText(command);
    dispatch(
      setMessageAndSeverity({
        message: 'Copied to clipboard.',
        severity: 'success'
      })
    );
    setTextCopied(true);
  };

  const checkBox = (id: number) => {
    setTextCopied(false);
    setSelectedBox(id);
  };

  const changeWithdrawalAddressHandler = (e: any) => {
    const { value } = e.target;
    setWithdrawalAddress(value);
    validateAddressInput(value, setAddressValidationError, false, 'Withdrawal address');
    setTextCopied(false);
    setConfirmedWithdrawalAddress(false);
  };

  const changeValidatorsCountHandler = (e: any) => {
    const { value } = e.target;
    if (Number(value) >= MIN_VALIDATORS_COUNT && Number(value) <= MAX_VALIDATORS_COUNT) {
      setIsInvalidValidatorsCount(false);
    } else {
      setIsInvalidValidatorsCount(true);
      setTextCopied(false);
    }
    setValidatorsCount(Number(value));
  };

  const showCopyButtonCondition =
    selectedBox === OFFLINE_FLOWS.COMMAND_LINE || (selectedBox === OFFLINE_FLOWS.DKG && withdrawalAddress && !addressValidationError.shouldDisplay && confirmedWithdrawalAddress);
  const commandCli = selectedBox === OFFLINE_FLOWS.COMMAND_LINE ? cliCommand : dkgCliCommand;
  const buttonLabelCondition =
    selectedBox === OFFLINE_FLOWS.COMMAND_LINE || selectedBox === OFFLINE_FLOWS.DESKTOP_APP || (selectedBox === OFFLINE_FLOWS.DKG && operatorsAcceptDkg) || selectedBox === 0;
  const cliCommandPanelCondition =
    selectedBox === OFFLINE_FLOWS.COMMAND_LINE || (selectedBox === OFFLINE_FLOWS.DKG && operatorsAcceptDkg && confirmedWithdrawalAddress && !isInvalidValidatorsCount);
  const buttonLabel = buttonLabelCondition
    ? translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.BUTTON.NEXT
    : translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.BUTTON.CHANGE_OPERATORS;
  const submitFunctionCondition = selectedBox === OFFLINE_FLOWS.DKG && !operatorsAcceptDkg;

  const disabledCondition = () => {
    if (selectedBox === OFFLINE_FLOWS.COMMAND_LINE) {
      return !textCopied;
    } else if (selectedBox === OFFLINE_FLOWS.DKG && operatorsAcceptDkg) {
      return !textCopied || isInvalidValidatorsCount;
    } else return selectedBox === 0;
  };

  const hideButtonCondition = () => {
    if (operatorsDKGHealth.isLoading) return false;
    if (submitFunctionCondition) {
      return !isSecondRegistration;
    }
    return true;
  };

  const MainScreen = (
    <BorderScreen
      blackHeader
      withoutNavigation={isSecondRegistration}
      header={translations.VALIDATOR.OFFLINE_KEY_SHARE_GENERATION.HEADER}
      overFlow={'none'}
      width={872}
      body={[
        <Grid container style={{ gap: 24 }}>
          <Grid container wrap={'nowrap'} item style={{ gap: 24 }}>
            <Grid
              container
              item
              className={`${classes.Box} ${isSelected(OFFLINE_FLOWS.COMMAND_LINE) ? classes.BoxSelected : ''} flex-1`}
              onClick={() => checkBox(OFFLINE_FLOWS.COMMAND_LINE)}
            >
              <Grid item xs={XS} className={cn(classes.ImageContainer, classes.CMDImage)} />
              <Typography className={classes.BlueText}>Command Line Interface</Typography>
              <Typography className={classes.AdditionalGrayText}>Generate from Existing Key</Typography>
            </Grid>
            <Grid container item className={`${classes.Box} ${isSelected(OFFLINE_FLOWS.DKG) ? classes.BoxSelected : ''} flex-1`} onClick={() => checkBox(OFFLINE_FLOWS.DKG)}>
              {operatorsDKGHealth.isLoading ? (
                <Grid item xs={XS} className={cn(classes.ImageContainer)}>
                  <div className="flex justify-center">
                    <div className="-mr-5">
                      <Spinner isWhite />
                    </div>
                  </div>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={XS}
                  className={cn(classes.ImageContainer, classes.DkgImage, {
                    [classes.DkgImageUnselected]: !isSelected(OFFLINE_FLOWS.DKG)
                  })}
                />
              )}
              <Grid className={classes.OptionTextWrapper}>
                <Typography className={classes.BlueText}>DKG</Typography>
                <Typography className={classes.AdditionalGrayText}>Generate from New Key</Typography>
              </Grid>
            </Grid>
          </Grid>
          {selectedBox === OFFLINE_FLOWS.DESKTOP_APP && (
            <Grid container item className={classes.UnofficialTool}>
              This app is an unofficial tool built as a public good by the OneStar team.
            </Grid>
          )}
          {selectedBox !== 0 && selectedBox !== OFFLINE_FLOWS.DKG && (
            <Grid container item>
              <Typography className={classes.GrayText} style={{ marginBottom: 16 }}>
                instructions:
              </Typography>
              <Grid container className={classes.ColumnDirection} item style={{ gap: 24 }}>
                {instructions.map((instruction) => {
                  if (instruction.id === selectedBox) {
                    return instruction.instructions.map((text, index: number) => {
                      return (
                        <Typography key={index} className={classes.BlackText}>
                          {text}
                        </Typography>
                      );
                    });
                  }
                })}
              </Grid>
            </Grid>
          )}
          {selectedBox === OFFLINE_FLOWS.DKG && operatorsAcceptDkg && !operatorsDKGHealth.isLoading && (
            <Grid container item className={classes.DkgInstructionsWrapper}>
              <Grid className={classes.DkgSectionWrapper}>
                <Typography className={classes.DkgTitle}>Prerequisite</Typography>
                <Grid className={classes.DkgText}>
                  <LinkText text={translations.VALIDATOR.DISTRIBUTE_OFFLINE.DKG.DOCKER_INSTALLED} link={config.links.DKG_DOCKER_INSTALL_URL} />
                  &nbsp;on the machine hosting the DKG client
                </Grid>
              </Grid>
              <Grid className={classes.DkgSectionWrapper}>
                <Typography className={classes.DkgTitle}>Instructions</Typography>
                <Grid className={classes.DkgText}>1. Select how many validators to generate</Grid>
                <Grid className={classes.DkgWithdrawAddressWrapper}>
                  <TextInput value={validatorsCount} onChangeCallback={changeValidatorsCountHandler} />
                  {isInvalidValidatorsCount && <Typography className={classes.DkgErrorMessage}>Validators count must be a number between 1-100.</Typography>}
                </Grid>
              </Grid>
              <Grid className={classes.DkgSectionWrapper}>
                <Grid className={classes.DkgText}>
                  2. Set Withdrawal Address <CustomTooltip text={translations.VALIDATOR.DISTRIBUTE_OFFLINE.DKG.DKG_WITHDRAWAL_ADDRESS} />
                </Grid>
                <Grid className={classes.DkgWithdrawAddressWrapper}>
                  <TextInput
                    value={withdrawalAddress}
                    onChangeCallback={changeWithdrawalAddressHandler}
                    sideButton={true}
                    sideButtonLabel={confirmedWithdrawalAddress ? 'Confirmed' : 'Confirm'}
                    sideButtonClicked={confirmedWithdrawalAddress}
                    sideButtonAction={confirmWithdrawalAddressHandler}
                    sideButtonDisabled={!withdrawalAddress || addressValidationError.shouldDisplay}
                  />
                  {addressValidationError.errorMessage && withdrawalAddress && <Typography className={classes.DkgErrorMessage}>{addressValidationError.errorMessage}</Typography>}
                </Grid>
              </Grid>
              {cliCommandPanelCondition && (
                <Grid className={classes.DkgSectionWrapper}>
                  <DkgTitleWrapper>
                    <Typography className={classes.DkgText}>3. Initiate the DKG ceremony with the following command:</Typography>
                    <OsButtonsWrapper>
                      {OPERATING_SYSTEMS.map((system) => (
                        <OsButtons
                          key={system.systemName}
                          onClick={() => {
                            setTextCopied(false);
                            setOperatingSystemName(system.systemName);
                          }}
                          isSelected={system.systemName === operatingSystemName}
                        >
                          {system.title}
                        </OsButtons>
                      ))}
                    </OsButtonsWrapper>
                  </DkgTitleWrapper>
                  <Grid container item className={classes.CopyWrapper} style={{ gap: textCopied ? 7 : 40 }}>
                    <Grid item xs className={classes.CopyText}>
                      {commandCli}
                    </Grid>
                    {showCopyButtonCondition && <CopyButton textCopied={textCopied} classes={classes} onClickHandler={copyToClipboard} />}
                  </Grid>
                  <Typography className={classes.DkgCliAdditionalText}>
                    Experiencing issues initiating the ceremony? Explore solutions in the{' '}
                    <LinkText style={{ fontSize: 14, fontWeight: 500 }} link={config.links.DKG_TROUBLESHOOTING_LINK} text={'troubleshooting guide.'} />
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
          {selectedBox === OFFLINE_FLOWS.DKG && !operatorsAcceptDkg && !operatorsDKGHealth.isLoading && (
            <Grid className={classes.DkgOperatorsWrapper}>
              <ErrorMessage text={translations.VALIDATOR.DISTRIBUTE_OFFLINE.DKG.OPERATOR_DOESNT_SUPPORT_DKG_ERROR_TEXT} />
              {Object.values(selectedOperators)
                .sort((a, b) => {
                  if (a.dkg_address && !b.dkg_address) {
                    return 1;
                  } else if (!a.dkg_address && b.dkg_address) {
                    return -1;
                  }
                  return a.id - b.id;
                })
                .map((operator: IOperator) => {
                  const isHealthy = operatorsDKGHealth.data?.find((o) => o.id === operator.id)?.isHealthy;
                  return <DkgOperator operator={operator} isHealthy={isHealthy} />;
                })}
            </Grid>
          )}
          {selectedBox === 1 && (
            <Grid container item className={classes.CopyWrapper} style={{ gap: textCopied ? 7 : 40 }}>
              <Grid item xs className={classes.CopyText}>
                {commandCli}
              </Grid>
              {showCopyButtonCondition && <CopyButton textCopied={textCopied} classes={classes} onClickHandler={copyToClipboard} />}
            </Grid>
          )}
          {hideButtonCondition() && (
            <PrimaryButton
              text={buttonLabel}
              onClick={submitFunctionCondition ? goToChangeOperators : () => goToNextPage(selectedBox, isSecondRegistration)}
              isDisabled={disabledCondition()}
              size={ButtonSize.XL}
            />
          )}
        </Grid>
      ]}
    />
  );

  if (isSecondRegistration) {
    return (
      <Grid container>
        <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} />
        {MainScreen}
      </Grid>
    );
  }

  return MainScreen;
};

export default observer(OfflineKeyShareGeneration);
