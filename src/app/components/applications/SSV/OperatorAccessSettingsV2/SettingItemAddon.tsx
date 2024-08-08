import styled from 'styled-components';
import { longStringShorten } from '~lib/utils/strings.ts';

const Address = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray40};
`;

const SettingItemAddon = ({ addresses }: { addresses: string[] }) =>
  addresses.length ? <Address>{addresses.length > 1 ? `${addresses.length} Addresses` : longStringShorten(addresses[0], 5, 4)}</Address> : null;

export default SettingItemAddon;
