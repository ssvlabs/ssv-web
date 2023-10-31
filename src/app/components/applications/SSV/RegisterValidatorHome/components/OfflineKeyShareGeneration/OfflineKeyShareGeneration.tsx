import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { osName, isWindows } from 'react-device-detect';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import { validateAddressInput } from '~lib/utils/validatesInputs';
import { getCurrentNetwork, NETWORKS } from '~lib/utils/envHelper';
import CustomTooltip from '~app/components/common/ToolTip/ToolTip';
import { checkDkgAddress } from '~lib/utils/operatorMetadataHelper';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import AccountStore from '~app/common/stores/applications/SsvWeb/Account.store';
import { CopyButton } from '~app/components/common/Button/CopyButton/CopyButton';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import DkgOperator from '~app/components/applications/SSV/RegisterValidatorHome/components/DkgOperator/DkgOperator';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/OfflineKeyShareGeneration/OfflineKeyShareGeneration.styles';

const OFFLINE_FLOWS = {
    COMMAND_LINE: 1,
    DESKTOP_APP: 2,
    DKG: 3,
};

const XS = 12;

const OfflineKeyShareGeneration = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const walletStore: WalletStore = stores.Wallet;
    const accountStore: AccountStore = stores.Account;
    const processStore: ProcessStore = stores.Process;
    const operatorStore: OperatorStore = stores.Operator;
    const [selectedBox, setSelectedBox] = useState(0);
    const [textCopied, setTextCopied] = useState(false);
    const [withdrawalAddress, setWithdrawalAddress] = useState('');
    const [addressValidationError, setAddressValidationError] = useState({ shouldDisplay: true, errorMessage: '' });
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { ownerNonce } = accountStore;
    const { accountAddress } = walletStore;
    const { apiNetwork, networkId } = getCurrentNetwork();
    const isNotMainnet = networkId !== NETWORKS.MAINNET;
    const [confirmedWithdrawalAddress, setConfirmedWithdrawalAddress] = useState(false);
    const operatorsAcceptDkg = Object.values(operatorStore.selectedOperators).every((operator: IOperator) => !checkDkgAddress(operator.dkg_address ?? ''));
    const dynamicFullPath = isWindows ? '%cd%' : '$(pwd)';

    const confirmWithdrawalAddressHandler = () => {
        if (confirmedWithdrawalAddress) {
            setConfirmedWithdrawalAddress(false);
            setTextCopied(false);
        } else {
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
        navigate(-4);
    };

    const sortedOperators = Object.values(operatorStore.selectedOperators).sort((a: any, b: any) => a.id - b.id);
    const { operatorsIds, operatorsKeys } = sortedOperators.reduce((aggr: any, operator: IOperator) => {
        aggr.operatorsIds.push(operator.id);
        aggr.operatorsKeys.push(operator.public_key);
        return aggr;
    }, {
        operatorsIds: [],
        operatorsKeys: [],
    });

    const operatorsInfo = Object.values(operatorStore.selectedOperators).map((operator: any) => {
        const newOperator = JSON.parse(JSON.stringify(operator));  // Deep copy
        newOperator.ip = newOperator.dkg_address;
        delete newOperator.dkg_address;
        return newOperator;
    });

    const cliCommand = `--operator-keys=${operatorsKeys.join(',')} --operator-ids=${operatorsIds.join(',') } --owner-address=${accountAddress} --owner-nonce=${ownerNonce}`;
    const dkgCliCommand = `docker run -v ${dynamicFullPath}:/data -it "bloxstaking/ssv-dkg:latest" /app init --owner ${walletStore.accountAddress} --nonce ${ownerNonce} --withdrawAddress ${withdrawalAddress} --operatorIDs ${operatorsIds.join(',')} --operatorsInfo '${JSON.stringify(operatorsInfo)}' --network ${apiNetwork} --generateInitiatorKey --outputPath /data`;

    const instructions = [
        {
            id: OFFLINE_FLOWS.COMMAND_LINE, instructions: [
                <Grid>1. Download the <b>{osName}</b> executable from <LinkText text={'SSV-Keys Github'}
                                                                             link={'https://github.com/bloxapp/ssv-keys/releases'}/></Grid>,
                '2. Launch your terminal',
                '3. Navigate to the directory you downladed the CLI tool',
                '4. Run the tool with the following command:',
            ],
        },
        {
            id: OFFLINE_FLOWS.DESKTOP_APP, instructions: [
                <Grid>1. Download the <b>{osName}</b> executable from <LinkText text={'SSV-Keys Github'}
                                                                                link={'https://github.com/bloxapp/ssv-keys/releases'}/></Grid>,
                '2.Run the Starkeys app',
                '3. When prompted, copy and paste the following command:',
            ],
        },
    ];

    const copyToClipboard = () => {
        const command = selectedBox === OFFLINE_FLOWS.COMMAND_LINE ? cliCommand : dkgCliCommand;
        navigator.clipboard.writeText(command);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
        setTextCopied(true);
    };

    const checkBox = (id: number) => {
        setTextCopied(false);
        setSelectedBox(id);
    };

    const changeWithdrawalAddressHandler = (e: any) => {
        const { value } = e.target;
        setWithdrawalAddress(value);
        validateAddressInput(value, setAddressValidationError);
        setTextCopied(false);
        setConfirmedWithdrawalAddress(false);
    };

    const showCopyButtonCondition = selectedBox === OFFLINE_FLOWS.COMMAND_LINE || (selectedBox === OFFLINE_FLOWS.DKG && withdrawalAddress && !addressValidationError.shouldDisplay && confirmedWithdrawalAddress);
    const commandCli = selectedBox === OFFLINE_FLOWS.COMMAND_LINE ? cliCommand : dkgCliCommand;
    const buttonLabelCondition = selectedBox === OFFLINE_FLOWS.COMMAND_LINE || selectedBox === OFFLINE_FLOWS.DKG && operatorsAcceptDkg || selectedBox === 0;
    const cliCommandPanelCondition = selectedBox === OFFLINE_FLOWS.COMMAND_LINE || selectedBox === OFFLINE_FLOWS.DKG && operatorsAcceptDkg;
    const buttonLabel = buttonLabelCondition ? 'Next' : 'Change Operators';
    const submitFunctionCondition = selectedBox === OFFLINE_FLOWS.DKG && !operatorsAcceptDkg;

    const disabledCondition = () => {
        if (selectedBox === OFFLINE_FLOWS.COMMAND_LINE || selectedBox === OFFLINE_FLOWS.DKG && operatorsAcceptDkg) {
            return !textCopied;
        } else if (selectedBox === 0) {
            return true;
        } else {
            return false;
        }
    };

    const hideButtonCondition = () => {
        if (submitFunctionCondition) {
            return !processStore.secondRegistration;
        }
        return true;
    };

    const MainScreen =
        <BorderScreen
            blackHeader
            withoutNavigation={processStore.secondRegistration}
            header={'How do you want to generate your keyshares?'}
            overFlow={'none'}
            width={isNotMainnet ? 872 : undefined}
            body={[
                <Grid container style={{ gap: 24 }}>
                    <Grid container wrap={'nowrap'} item style={{ gap: 24 }}>
                        <Grid container item className={`${classes.Box} ${isSelected(OFFLINE_FLOWS.COMMAND_LINE) ? classes.BoxSelected : ''}`}
                              onClick={() => checkBox(OFFLINE_FLOWS.COMMAND_LINE)}>
                            <Grid item xs={XS} className={classes.Image}/>
                            <Typography className={classes.BlueText}>Command Line Interface</Typography>
                        </Grid>
                        <Tooltip title="Coming soon..." placement="top-end" children={
                            <Grid>
                                <Grid container 
                                      item
                                      className={`${classes.Box} ${classes.Disable} ${isSelected(OFFLINE_FLOWS.DESKTOP_APP) ? classes.BoxSelected : ''}`}
                                      onClick={() => checkBox(OFFLINE_FLOWS.DESKTOP_APP)}>
                                      <Grid item xs={XS} className={`${classes.Image} ${classes.Desktop}`}/>
                                      <Typography className={classes.BlueText}>Desktop App</Typography>
                                </Grid>
                            </Grid>}/>
                        {isNotMainnet && <Grid container item className={`${classes.Box} ${isSelected(OFFLINE_FLOWS.DKG) ? classes.BoxSelected : ''}`}
                               onClick={() => checkBox(OFFLINE_FLOWS.DKG)}>
                            <Grid item xs={XS} className={`${classes.Image} ${classes.DkgImage} ${!isSelected(OFFLINE_FLOWS.DKG) && classes.DkgImageUnselected}`}/>
                            <Typography className={classes.BlueText}>DKG</Typography>
                        </Grid>}
                    </Grid>
                    {selectedBox === OFFLINE_FLOWS.DESKTOP_APP && <Grid container item className={classes.UnofficialTool}>
                        This app is an unofficial tool built as a public good by the OneStar team.
                    </Grid>}
                    {selectedBox !== 0 && selectedBox !== OFFLINE_FLOWS.DKG && <Grid container item>
                        <Typography className={classes.GrayText} style={{ marginBottom: 16 }}>instructions:</Typography>
                        <Grid container className={classes.ColumnDirection} item style={{ gap: 24 }}>
                            {instructions.map((instruction) => {
                                if (instruction.id === selectedBox) {
                                    return instruction.instructions.map((text, index: number) => {
                                        return <Typography key={index}
                                                           className={classes.BlackText}>{text}</Typography>;
                                    });
                                }
                            })}
                        </Grid>
                    </Grid>
                    }
                    {selectedBox === OFFLINE_FLOWS.DKG && isNotMainnet && operatorsAcceptDkg && <Grid container item className={classes.DkgInstructionsWrapper}>
                        <Grid className={classes.DkgNotification}>
                            Please note that this tool is yet to be audited. Please refrain from using it on mainnet.
                        </Grid>
                        <Typography className={classes.DkgTitle}>Prerequisite</Typography>
                        <Grid className={classes.DkgText}><LinkText text={'Docker installed'} link={'https://docs.docker.com/engine/install/'}/>&nbsp;on the machine hosting the DKG client</Grid>
                        <Typography className={classes.DkgTitle}>Instructions</Typography>
                        <Grid className={classes.DkgText}>1. Set Withdrawal Address <CustomTooltip text={'Ethereum address to receive staking rewards and principle staked ETH. Please note that this cannot be changed in the future.'}/></Grid>
                        <Grid className={classes.DkgWithdrawAddressWrapper}>
                            <Typography className={classes.DkgInputLabel}>Withdrawal Address</Typography>
                            <TextInput value={withdrawalAddress}
                                       onChangeCallback={changeWithdrawalAddressHandler}
                                       sideButton={true}
                                       sideButtonLabel={confirmedWithdrawalAddress ? 'Confirmed' : 'Confirm'}
                                       sideButtonClicked={confirmedWithdrawalAddress}
                                       sideButtonAction={confirmWithdrawalAddressHandler}
                                       sideButtonDisabled={!withdrawalAddress || addressValidationError.shouldDisplay} />
                            {addressValidationError.errorMessage && withdrawalAddress && <Typography className={classes.DkgErrorMessage}>{addressValidationError.errorMessage}</Typography>}
                        </Grid>
                        <Typography className={classes.DkgText}>2. Initiate the DKG ceremony with the following command:</Typography>
                    </Grid>}
                    {selectedBox === 3 && !operatorsAcceptDkg && <Grid className={classes.DkgOperatorsWrapper}>
                        <ErrorMessage text={'DKG method is unavailable because some of your selected operators have not provided a DKG endpoint. '} />
                        {Object.values(operatorStore.selectedOperators).map((operator: IOperator) => <DkgOperator operator={operator} />)}
                    </Grid>}
                    {cliCommandPanelCondition &&
                        <Grid container item className={classes.CopyWrapper} style={{ gap: textCopied ? 7 : 40 }}>
                            <Grid item xs className={classes.CopyText}>{commandCli}</Grid>
                            {showCopyButtonCondition && <CopyButton textCopied={textCopied} classes={classes} onClickHandler={copyToClipboard}/>}
                        </Grid>
                    }
                    {hideButtonCondition() && <PrimaryButton text={buttonLabel}
                                    submitFunction={submitFunctionCondition ? goToChangeOperators : () => goToNextPage(selectedBox, processStore.secondRegistration)}
                                    disable={disabledCondition()}/>}
                </Grid>,
            ]}
        />;

    if (processStore.secondRegistration) {
        return (
            <Grid container>
                <NewWhiteWrapper
                    type={0}
                    header={'Cluster'}
                />
                {MainScreen}
            </Grid>
        );
    }

    return MainScreen;
};

export default observer(OfflineKeyShareGeneration);
