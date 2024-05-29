import PermissionSettingsDashboard from '~app/components/applications/SSV/OperatorAccessSettingsV2/PermissionSettingsDashboard.tsx';
import { useState } from 'react';
import AddressesList from '~app/components/applications/SSV/OperatorAccessSettingsV2/AddressesList.tsx';

export enum PermissionSections {
  Dashboard,
  OperatorStatus,
  AuthorizedAddresses,
  ExternalContract
}

const OperatorAccessSettingsV2 = () => {
  const [currentSection, setCurrentSection] = useState<PermissionSections>(PermissionSections.Dashboard);

  const changeSection = (section: PermissionSections) => {
    setCurrentSection(section);
  };

  const components = {
    [PermissionSections.Dashboard]: PermissionSettingsDashboard,
    [PermissionSections.OperatorStatus]: PermissionSettingsDashboard,
    [PermissionSections.AuthorizedAddresses]: AddressesList,
    [PermissionSections.ExternalContract]: PermissionSettingsDashboard
  };

  const Component = components[currentSection];

  return <Component changeSection={changeSection} />;
};

export default OperatorAccessSettingsV2;
