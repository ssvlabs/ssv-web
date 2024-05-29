import { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ theme: any; isSelected: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: ${({ theme, isSelected }) => `1px solid ${isSelected ? theme.colors.tint40 : theme.colors.gray30}`};
  padding: 10px 20px;
`;

// const Input = styled.input`
//     font-size: 16;
//     width: 100%;
//     font-weight: 500;
//     line-height: 1.62;
//     border: none !important;
//     color: ${({ theme }) => theme.colors.gray90};
//     resize: none;
//     background-color: transparent;
//     &:focus: {
//         outline: none;
//         border: none !important;
//         border-color: none !important;
//     }
//
// ,`;

const AddressSlot = () => {
  const [address, setAddress] = useState('');

  const changeAddressHandler = (e: any) => {
    const { value } = e.target;
    console.log(value);
    setAddress(value);
  };

  return (
    <Wrapper isSelected={true}>
      <input onChange={changeAddressHandler} value={address} />
    </Wrapper>
  );
};

export default AddressSlot;
