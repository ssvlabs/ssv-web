import { Card } from '~app/atomicComponents/Card';
import config from '~app/common/config';
import { ActiveBadge } from '~app/components/applications/SSV/OperatorAccessSettingsV2/ActiveBadge';
import { OperatorStatusBadge } from '~app/components/applications/SSV/OperatorAccessSettingsV2/OperatorStatusBadge';
import { PermissionSettingsItem } from '~app/components/applications/SSV/OperatorAccessSettingsV2/PermissionSettingsItem';
import BorderScreen from '~app/components/common/BorderScreen';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

const PermissionSettingsDashboard = () => {
  const selectedOperator = useAppSelector(getSelectedOperator);
  console.log('selectedOperator:', selectedOperator);

  return (
    <BorderScreen blackHeader width={872}>
      <Card variant="unstyled" className="not-last:border-b not-last:border-gray-300 overflow-hidden">
        <PermissionSettingsItem
          className="pt-8"
          title={<h2 className="text-xl">Permission Settings</h2>}
          description={
            <p>
              Use the options below to activate permissioned operator settings and restrict validator registration to
              authorized addresses only. Learn more about{' '}
              <a
                href="https://docs.ssv.network/learn/operators/permissioned-operators"
                className="text-primary-500"
                target="_blank"
              >
                Permissioned Operators
              </a>
              .
            </p>
          }
        />
        <PermissionSettingsItem
          title="Operator Status"
          description={
            'Switch between public and private statuses for the operator.\n' +
            'Set the operator to private to enforce whitelisted addresses.'
          }
          route={config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.STATUS}
          addon={<OperatorStatusBadge isPrivate={selectedOperator.is_private} />}
        />
        <PermissionSettingsItem
          title="Authorized Addresses"
          description="Add Ethereum addresses to the whitelist for authorization"
          route={config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.AUTHORIZED_ADDRESSES}
          addon={<ActiveBadge isActive={Boolean(selectedOperator.whitelist_addresses?.length)} />}
        />
        <PermissionSettingsItem
          className="pb-8"
          title="External Contract"
          description="Manage whitelisted addresses through an external contract"
          addon={<ActiveBadge isActive={Boolean(selectedOperator.whitelisting_contract)} />}
          route={config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.EXTERNAL_CONTRACT}
        />
      </Card>
    </BorderScreen>
  );
};

export default PermissionSettingsDashboard;
