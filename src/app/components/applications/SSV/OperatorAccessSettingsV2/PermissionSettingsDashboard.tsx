import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import config from '~app/common/config';
import PermissionSettingsSection from '~app/components/applications/SSV/OperatorAccessSettingsV2/PermissionSettingsSection.tsx';
import BorderScreen from '~app/components/common/BorderScreen';
import LinkText from '~app/components/common/LinkText/LinkText.tsx';
import { useOperatorPermissions } from '~app/hooks/operator/useOperatorPermissions';

const SubTitle = styled.div`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray80};
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PermissionSettingsDashboard = () => {
  const navigate = useNavigate();

  const permissions = useOperatorPermissions();

  return (
    <BorderScreen
      blackHeader
      width={872}
      header={'Permission Settings'}
      body={[
        <Wrapper>
          <div>
            <SubTitle>Activating the permissioned operator setting will restrict validator registration to only the set authorized addresses.</SubTitle>
            <SubTitle>
              Read more on <LinkText textSize={14} text={'Permissioned Operators.'} />
            </SubTitle>
          </div>
          <SubTitle>You can utilize both authorized addresses and external contract at the same time.</SubTitle>
        </Wrapper>,
        <PermissionSettingsSection
          onClick={() => navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.STATUS)}
          subTitle={'Switch between public and private statuses for the operator.\n' + 'Set the operator to private to enforce whitelisted addresses.'}
          title={'Operator Status'}
          isOperatorStatus
          status={permissions.data?.visibility ?? ''}
        />,
        <PermissionSettingsSection
          onClick={() => navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.AUTHORIZED_ADDRESSES)}
          subTitle={'Add Ethereum addresses to the whitelist for authorization'}
          title={'Authorized Addresses'}
          status={permissions.data?.addresses.length ? 'On' : 'Off'}
        />,
        <PermissionSettingsSection
          onClick={() => navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ACCESS_SETTINGS.EXTERNAL_CONTRACT)}
          subTitle={'Manage whitelisted addresses through an external contract'}
          title={'External Contract'}
          status={permissions.data?.externalContract ? 'On' : 'Off'}
        />
      ]}
    />
  );
};

export default PermissionSettingsDashboard;
