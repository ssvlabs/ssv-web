import { Switch as MaterialSwitch } from '@mui/material';
import styled from 'styled-components';

const CustomSwitch = styled(MaterialSwitch)<{ isChecked: boolean }>`
  width: 42px;
  height: 26px;
  padding: 0;

  & .MuiSwitch-switchBase {
    padding: 0;
    margin: 2px;
    transition-duration: 300ms;

    &.Mui-checked {
      transform: translateX(16px);
      color: ${({ theme }) => theme.colors.primaryBlue};

      & + .MuiSwitch-track {
        background-color: ${({ theme }) => theme.colors.primaryBlue};
        opacity: 1;
        border: ${({ theme }) => `1px solid ${theme.colors.primaryBlue}`};
      }

      &.Mui-disabled + .MuiSwitch-track {
        opacity: 0.5;
      }
    }

    &.Mui-focusVisible .MuiSwitch-thumb {
      background-color: ${({ theme }) => theme.colors.gray40};
      color: #33cf4d;
      border: 6px solid #fff;
    }

    &.Mui-disabled .MuiSwitch-thumb {
      background-color: ${({ theme }) => theme.colors.gray40};
    }

    &.Mui-disabled + .MuiSwitch-track {
      opacity: ${({ theme }) => (theme.darkMode ? 0.7 : 0.3)};
    }
  }

  & .MuiSwitch-thumb {
    box-sizing: border-box;
    width: 22px;
    height: 22px;
    background-color: ${({ theme, isChecked }) => (!isChecked ? theme.colors.gray40 : theme.colors.white)};
  }

  & .MuiSwitch-track {
    border-radius: 26px;
    background-color: ${({ theme, isChecked }) => (isChecked ? theme.colors.primaryBlue : theme.colors.white)};
    border: ${({ theme }) => `1px solid ${theme.colors.gray40}`};
    opacity: 1;
  }
`;

const Switch = ({ isChecked, setIsChecked }: { isChecked: boolean; setIsChecked: Function }) => (
  <CustomSwitch checked={isChecked} onChange={() => setIsChecked()} isChecked={isChecked} />
);

export default Switch;
