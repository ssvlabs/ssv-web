import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, PrimaryButton } from '~app/atomicComponents';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/applications/SSV/OperatorConfirmation/OperatorConfirmation.styles';
import AddressKeyInput from '~app/components/common/AddressKeyInput';
import BorderScreen from '~app/components/common/BorderScreen';
import NameAndAddress from '~app/components/common/NameAndAddress';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { ButtonSize } from '~app/enums/Button.enum';
import { useSetOptimisticOperator } from '~app/hooks/operator/useSetOptimisticOperator';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import { decodeParameter } from '~root/services/conversions.service';
import { addNewOperator } from '~root/services/operatorContract.service.ts';

const createDefaultOperator = (args: OperatorAddedEvent['args'] & { isPrivate?: boolean }): IOperator => ({
  id: Number(args.operatorId),
  id_str: args.operatorId.toString(),
  declared_fee: '0',
  previous_fee: '0',
  balance: 0,
  fee: args.fee.toString(),
  public_key: args.publicKey,
  owner_address: args.owner,
  address_whitelist: '',
  is_private: args.isPrivate ?? false,
  whitelisting_contract: '',
  location: '',
  setup_provider: '',
  eth1_node_client: '',
  eth2_node_client: '',
  mev_relays: '',
  description: '',
  website_url: '',
  twitter_url: '',
  linkedin_url: '',
  dkg_address: '',
  logo: '',
  type: 'operator',
  name: `Operator ${args.operatorId}`,
  performance: {
    '24h': 0,
    '30d': 0
  },
  is_valid: true,
  is_deleted: false,
  is_active: 0,
  status: 'Inactive',
  validators_count: 0,
  version: 'v4',
  network: 'holesky',
  whitelist_addresses: [],
  updated_at: 0
});

type OperatorAddedEvent = {
  eventName: 'OperatorAdded';
  args: {
    operatorId: bigint;
    owner: `0x${string}`;
    fee: bigint;
    publicKey: `0x${string}`;
  };
};

const OperatorConfirmation = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionButtonText, setActionButtonText] = useState('Register Operator');
  const navigate = useNavigate();
  const location = useLocation();
  const { operatorRawData, isPrivate } = location.state;
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);
  const isMainnet = useAppSelector(getIsMainnet);
  const classes = useStyles();
  const setOptimisticOperator = useSetOptimisticOperator();

  const onRegisterClick = async () => {
    setIsLoading(true);
    setActionButtonText('Waiting for confirmation...');
    let newOperator: IOperator | undefined;
    await addNewOperator({
      isContractWallet,
      operatorRawData,
      isPrivate,
      dispatch,
      onConfirmed: (events) => {
        const operatorAddedEvent = events?.find((event) => (event as OperatorAddedEvent).eventName === 'OperatorAdded') as OperatorAddedEvent | undefined;
        if (operatorAddedEvent) {
          newOperator = createDefaultOperator({ ...operatorAddedEvent.args, isPrivate });
          setOptimisticOperator({
            operator: newOperator,
            type: 'created'
          });
        }
      }
    });
    if (newOperator) {
      navigate(isContractWallet ? config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD : config.routes.SSV.OPERATOR.SUCCESS_PAGE, {
        state: {
          operatorRawData: {
            ...operatorRawData,
            id: newOperator.id
          }
        }
      });
    } else {
      setActionButtonText('Register Operator');
    }
    setIsLoading(false);
  };

  return (
    <BorderScreen
      blackHeader
      withConversion
      headerMarginTop={'none'}
      navigatorHeight={60}
      sectionClass={classes.Section}
      subHeaderText={'Register Operator'}
      header={translations.OPERATOR.CONFIRMATION.TITLE}
      body={[
        <Grid container>
          <Grid container style={{ gap: 34 }}>
            <Grid container item>
              <Grid item className={classes.SubHeader}>
                Operator Key
              </Grid>
              <AddressKeyInput address={decodeParameter('string', operatorRawData.publicKey)} />
            </Grid>
            <Grid container item>
              <Grid item xs={6}>
                <NameAndAddress name={'Owner Address'} />
              </Grid>
              <Grid item xs={6} className={classes.AlignRight}>
                <NameAndAddress name={`0x${longStringShorten(operatorRawData.address.substring(2), 4)}`} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>,
        <Grid container style={{ gap: 24 }}>
          <Grid container item style={{ gap: 16 }}>
            <Grid container item>
              <Grid item className={classes.SubHeader}>
                Details
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item xs={6}>
                <NameAndAddress name={'Fee'} />
              </Grid>
              <Grid item xs={6} className={classes.AlignRight}>
                <SsvAndSubTitle ssv={formatNumberToUi(operatorRawData.fee)} subText={'/year'} />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item>
            <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)} isMainnet={isMainnet}>
              <PrimaryButton isDisabled={isMainnet && !isChecked} isLoading={isLoading} text={actionButtonText} onClick={onRegisterClick} size={ButtonSize.XL} />
            </TermsAndConditionsCheckbox>
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default OperatorConfirmation;
