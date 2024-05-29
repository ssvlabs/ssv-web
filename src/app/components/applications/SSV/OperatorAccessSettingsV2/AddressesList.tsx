import styled from 'styled-components';
import AddressSlot from '~app/components/applications/SSV/OperatorAccessSettingsV2/AddressSlot.tsx';
import BorderScreen from '~app/components/common/BorderScreen';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const AddAddressSlot = styled.div`
  width: 100%;
  height: 48px;
  border: ${({ theme }) => `1px dashed ${theme.colors.gray30}`};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray40};
  cursor: pointer;
`;

const AddressesList = () => {
  return (
    <BorderScreen
      blackHeader
      width={872}
      header={'Authorized Addresses'}
      body={[
        <Wrapper>
          <AddressSlot />
          <AddAddressSlot>+ Add Authorized Address</AddAddressSlot>
        </Wrapper>
      ]}
    />
  );
};

export default AddressesList;
