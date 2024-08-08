import { ComponentProps, ComponentType, lazy, Suspense } from 'react';
import { Route, Routes as Wrapper } from 'react-router-dom';
import config from '~app/common/config';
import Announcement from '~app/components/common/Annotation/Announcement';
import SsvAppBar from '~app/components/common/AppBar/SsvAppBar';
import Layout from '~app/components/common/Layout';
import MaintenancePage from '~app/components/applications/SSV/Maintenance/MaintenancePage.tsx';

const Welcome = lazy(() => import('~app/components/applications/SSV/Welcome/Welcome'));
const FeeRecipient = lazy(() => import('~app/components/applications/SSV/FeeRecipient'));
const SetOperatorFee = lazy(() => import('~app/components/applications/SSV/SetOperatorFee'));
const Deposit = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Deposit'));
const CountryNotSupported = lazy(() => import('~app/components/applications/SSV/CountryNotSupported'));
const OperatorSuccessPage = lazy(() => import('~app/components/applications/SSV/OperatorSuccessPage'));
const GenerateOperatorKeys = lazy(() => import('~app/components/applications/SSV/GenerateOperatorKeys'));
const RegisterOperatorHome = lazy(() => import('~app/components/applications/SSV/RegisterOperatorHome'));
const NewWithdraw = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Withdraw'));
const RegisterValidatorHome = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome'));
const ValidatorSuccessScreen = lazy(() => import('~app/components/applications/SSV/ValidatorSuccessScreen'));
const SingleOperator = lazy(() => import('~app/components/applications/SSV/MyAccount/components/SingleOperator'));
const RemoveOperator = lazy(() => import('~app/components/applications/SSV/MyAccount/components/RemoveOperator'));
const UpdateFee = lazy(() => import('~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee'));
const OperatorTransactionConfirmation = lazy(() => import('~app/components/applications/SSV/OperatorConfirmation'));
const ClusterDashboard = lazy(() => import('~app/components/applications/SSV/MyAccount/components/ClusterDashboard'));
const BulkComponent = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/BulkActions/BulkComponent'));
const ImportFile = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile'));
const ReactivateCluster = lazy(() => import('~app/components/applications/SSV/MyAccount/components/ReactivateCluster'));
const OperatorDashboard = lazy(() => import('~app/components/applications/SSV/MyAccount/components/OperatorDashboard'));
const FundingPeriod = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/FundingPeriod'));
const EditOperatorDetails = lazy(() => import('~app/components/applications/SSV/MyAccount/components/EditOperatorDetails'));
const SingleCluster = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster'));
const CreateValidator = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator'));
const SlashingWarning = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/SlashingWarning'));
const SelectOperators = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators'));
const ValidatorTransactionConfirmation = lazy(() => import('~app/components/applications/SSV/ValidatorRegistrationConfirmation'));
const GenerateKeyShares = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/GenerateKeyShares'));
const OperatorPermissionSettingsDashboard = lazy(() => import('~app/components/applications/SSV/OperatorAccessSettingsV2/PermissionSettingsDashboard.tsx'));
const OperatorPermissionAddressesList = lazy(() => import('~app/components/applications/SSV/OperatorAccessSettingsV2/AddressesList.tsx'));
const OperatorPermissionExternalContract = lazy(() => import('~app/components/applications/SSV/OperatorAccessSettingsV2/ExternalContract.tsx'));
const OperatorPermissionStatus = lazy(() => import('~app/components/applications/SSV/OperatorAccessSettingsV2/Status.tsx'));
const FundingNewValidator = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/FundingNewValidator'));
const DepositViaLaunchpad = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/DepositViaLaunchpad'));
const AccountBalanceAndFee = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/AccountBalanceAndFee'));
const OfflineKeyShareGeneration = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/OfflineKeyShareGeneration'));
const OfflineKeyShareCeremony = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/OfflineKeyShareCeremony'));
const MetadataConfirmationPage = lazy(() => import('~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/MetadataConfirmationPage'));

// TODO: Make it generic with type inference
interface RouteConfig {
  path: string;
  Component: ComponentType<any>;
  props?: ComponentProps<any>;
}

const SsvWebRoutes = () => {
  const ssvRoutes = config.routes.SSV;

  const dashboardRoutes: RouteConfig[] = [
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.DEPOSIT, Component: Deposit },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.ROOT, Component: SingleOperator },
    // TODO: add future flag V2 should be for testnet only
    {
      path: ssvRoutes.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.ROOT,
      Component: OperatorPermissionSettingsDashboard
    },
    {
      path: ssvRoutes.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.AUTHORIZED_ADDRESSES,
      Component: OperatorPermissionAddressesList
    },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.STATUS, Component: OperatorPermissionStatus },
    {
      path: ssvRoutes.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.EXTERNAL_CONTRACT,
      Component: OperatorPermissionExternalContract
    },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.ROOT, Component: SingleCluster },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.WITHDRAW, Component: NewWithdraw, props: { isValidatorFlow: true } satisfies ComponentProps<typeof NewWithdraw> },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.WITHDRAW, Component: NewWithdraw, props: { isValidatorFlow: false } satisfies ComponentProps<typeof NewWithdraw> },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER_DASHBOARD, Component: ClusterDashboard },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.FEE_RECIPIENT, Component: FeeRecipient },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.UPLOAD_KEY_STORE, Component: ImportFile },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.REMOVE.ROOT, Component: RemoveOperator },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.REACTIVATE, Component: ReactivateCluster },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR_DASHBOARD, Component: OperatorDashboard },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.META_DATA, Component: EditOperatorDetails },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.SLASHING_WARNING, Component: SlashingWarning },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR, Component: FundingNewValidator },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.SUCCESS_PAGE, Component: ValidatorSuccessScreen },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.BULK, Component: BulkComponent },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.ROOT, Component: UpdateFee },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES, Component: ImportFile, props: { type: 2 } satisfies ComponentProps<typeof ImportFile> },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.DISTRIBUTE_OFFLINE, Component: OfflineKeyShareGeneration },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.DISTRIBUTION_METHOD_START, Component: GenerateKeyShares },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.META_DATA_CONFIRMATION, Component: MetadataConfirmationPage },
    { path: ssvRoutes.MY_ACCOUNT.CLUSTER.CONFIRMATION_PAGE, Component: ValidatorTransactionConfirmation }
  ];

  const operatorRoutes: RouteConfig[] = [
    { path: ssvRoutes.OPERATOR.SET_FEE_PAGE, Component: SetOperatorFee },
    { path: ssvRoutes.OPERATOR.SUCCESS_PAGE, Component: OperatorSuccessPage },
    { path: ssvRoutes.OPERATOR.GENERATE_KEYS, Component: GenerateOperatorKeys },
    { path: ssvRoutes.OPERATOR.CONFIRMATION_PAGE, Component: OperatorTransactionConfirmation }
  ];

  const validatorsRoutes: RouteConfig[] = [
    { path: ssvRoutes.VALIDATOR.IMPORT, Component: ImportFile },
    { path: ssvRoutes.VALIDATOR.CREATE, Component: CreateValidator },
    { path: ssvRoutes.VALIDATOR.SELECT_OPERATORS, Component: SelectOperators },
    { path: ssvRoutes.VALIDATOR.SLASHING_WARNING, Component: SlashingWarning },
    { path: ssvRoutes.VALIDATOR.FUNDING_PERIOD_PAGE, Component: FundingPeriod },
    { path: ssvRoutes.VALIDATOR.SUCCESS_PAGE, Component: ValidatorSuccessScreen },
    { path: ssvRoutes.VALIDATOR.DEPOSIT_VALIDATOR, Component: DepositViaLaunchpad },
    { path: ssvRoutes.VALIDATOR.DISTRIBUTION_METHOD.START, Component: GenerateKeyShares },
    { path: ssvRoutes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE, Component: AccountBalanceAndFee },
    { path: ssvRoutes.VALIDATOR.CONFIRMATION_PAGE, Component: ValidatorTransactionConfirmation },
    { path: ssvRoutes.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_OFFLINE, Component: OfflineKeyShareGeneration },
    { path: ssvRoutes.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_SUMMARY, Component: OfflineKeyShareCeremony },
    { path: ssvRoutes.VALIDATOR.DISTRIBUTION_METHOD.UPLOAD_KEYSHARES, Component: ImportFile, props: { type: 2 } satisfies ComponentProps<typeof ImportFile> }
  ];

  return (
    <Layout>
      <Announcement />
      <SsvAppBar />
      <Suspense fallback={<div className="container"></div>}>
        <Wrapper>
          <Route path={'/'} element={<Welcome />} />
          <Route path={config.routes.SSV.MAINTENANCE} element={<MaintenancePage />} />
          <Route path={config.routes.COUNTRY_NOT_SUPPORTED} element={<CountryNotSupported />} />
          <Route path={ssvRoutes.ROOT} element={<Welcome />} />
          <Route path={ssvRoutes.MY_ACCOUNT.ROOT}>
            {dashboardRoutes.map((route, index: number) => {
              return <Route key={index} path={route.path} element={<route.Component {...route.props} />} />;
            })}
          </Route>
          <Route path={ssvRoutes.OPERATOR.HOME}>
            <Route index element={<RegisterOperatorHome />} />
            {operatorRoutes.map((route, index: number) => {
              return <Route key={index} path={route.path} element={<route.Component {...route.props} />} />;
            })}
          </Route>
          <Route path={ssvRoutes.VALIDATOR.HOME}>
            <Route index element={<RegisterValidatorHome />} />
            {validatorsRoutes.map((route, index: number) => {
              return <Route key={index} path={route.path} element={<route.Component {...route.props} />} />;
            })}
          </Route>
        </Wrapper>
      </Suspense>
    </Layout>
  );
};

export default SsvWebRoutes;
