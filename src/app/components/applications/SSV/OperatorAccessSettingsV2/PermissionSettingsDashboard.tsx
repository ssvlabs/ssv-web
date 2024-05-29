import styled from 'styled-components';
import BorderScreen from '~app/components/common/BorderScreen';
import LinkText from '~app/components/common/LinkText/LinkText.tsx';
import PermissionSettingsSection from '~app/components/applications/SSV/OperatorAccessSettingsV2/PermissionSettingsSection.tsx';
import { PermissionSections } from '~app/components/applications/SSV/OperatorAccessSettingsV2/OperatorAccessSettingsV2.tsx';

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

const PermissionSettingsDashboard = ({ changeSection }: { changeSection: Function }) => {
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
          onClick={() => changeSection(PermissionSections.OperatorStatus)}
          subTitle={'Switch between public and private statuses for the operator.\n' + 'Set the operator to private to enforce whitelisted addresses.'}
          title={'Operator Status'}
          isOperatorStatus
          status={'Public'}
        />,
        <PermissionSettingsSection
          onClick={() => changeSection(PermissionSections.AuthorizedAddresses)}
          subTitle={'Add Ethereum addresses to the whitelist for authorization'}
          title={'Authorized Addresses'}
          status={'Off'}
        />,
        <PermissionSettingsSection
          onClick={() => changeSection(PermissionSections.ExternalContract)}
          subTitle={'Manage whitelisted addresses through an external contract'}
          title={'External Contract'}
          status={'Off'}
        />
      ]}
    />
  );
};

export default PermissionSettingsDashboard;
