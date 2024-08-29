import { Card } from '~app/atomicComponents/Card';
import config from '~app/common/config';
import { OperatorStatusBadge } from '~app/components/applications/SSV/OperatorAccessSettingsV2/OperatorStatusBadge';
import { PermissionSettingsItem } from '~app/components/applications/SSV/OperatorAccessSettingsV2/PermissionSettingsItem';
import BorderScreen from '~app/components/common/BorderScreen';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';
import { FaCircleInfo } from 'react-icons/fa6';
import { Tooltip } from '~app/components/ui/tooltip';
import SettingItemAddon from '~app/components/applications/SSV/OperatorAccessSettingsV2/SettingItemAddon.tsx';

const PermissionSettingsDashboard = () => {
  const selectedOperator = useAppSelector(getSelectedOperator)!;
  const whitelistingContract =
    selectedOperator.whitelisting_contract && selectedOperator.whitelisting_contract !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST
      ? [selectedOperator?.whitelisting_contract]
      : [];

  return (
    <BorderScreen blackHeader width={872}>
      <Card variant="unstyled" className="not-last:border-b not-last:border-gray-300 overflow-hidden">
        <PermissionSettingsItem
          className="pt-8"
          title={
            <h2 className="text-xl flex items-center gap-2">
              <span>Permission Settings</span>
              <Tooltip
                content={
                  <div>
                    Learn more about{' '}
                    <a href={config.links.PERMISSIONED_OPERATORS} className="link text-primary-500" target="_blank">
                      Permissioned Operators
                    </a>
                  </div>
                }
              >
                <FaCircleInfo className="size-4 text-gray-500" />
              </Tooltip>
            </h2>
          }
          description={<p>Use the options below to activate permissioned operator settings and restrict validator registration to whitelisted addresses only.</p>}
        />
        <PermissionSettingsItem
          title="Operator Status"
          description={'Switch between public and private modes for operator access control.'}
          route={config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.STATUS}
          addon={<OperatorStatusBadge isPrivate={selectedOperator.is_private} />}
        />
        <PermissionSettingsItem
          title="Authorized Addresses"
          description="Manage owner addresses authorized to register validators to your operator."
          route={config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.AUTHORIZED_ADDRESSES}
          addon={<SettingItemAddon addresses={selectedOperator?.whitelist_addresses || []} />}
        />
        <PermissionSettingsItem
          className="pb-8"
          title="External Contract"
          description="Manage whitelisted addresses through an external contract."
          addon={<SettingItemAddon addresses={whitelistingContract} />}
          route={config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.EXTERNAL_CONTRACT}
        />
      </Card>
    </BorderScreen>
  );
};

export default PermissionSettingsDashboard;
