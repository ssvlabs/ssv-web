import React from 'react';
import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import Dialog from '@mui/material/Dialog';
import { ButtonPropsType } from '~app/types/ButtonPropsType.ts';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { getModalPopUp, setModalPopUp } from '~app/redux/appState.slice.ts';

const DialogWrapper = styled(Dialog)<{ theme: any }>`
  & > div > div {
    border-radius: 16px;
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const Wrapper = styled(Grid)<{ theme: any; width?: number }>`
  width: ${({ width }) => `${width || 424}px`};
  padding: 32px;
  border-radius: 16px;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  gap: 12px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const CloseButton = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ theme }) => `url(/images/exit/${theme.colors.isDarkMode ? 'dark' : 'light'}.svg)`};
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray90};
`;

const Text = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray80};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 20px;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
`;

const ModalPopUp = () => {
  const modalPopUp = useAppSelector(getModalPopUp);
  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(setModalPopUp(null));
  };

  return (
    <DialogWrapper aria-labelledby="simple-dialog-title" open={!!modalPopUp}>
      <Wrapper width={modalPopUp?.width} container>
        <HeaderWrapper>
          <Title>{modalPopUp?.title}</Title>
          <CloseButton onClick={closeModal} />
        </HeaderWrapper>
        <TextWrapper>{modalPopUp?.text.map((data: string) => <Text>{data}</Text>)}</TextWrapper>
        <ButtonsWrapper>
          {modalPopUp?.buttons.map((data: { component: React.FC<ButtonPropsType>; props: ButtonPropsType }) => {
            const Component = data.component;
            return <Component {...data.props} />;
          })}
        </ButtonsWrapper>
      </Wrapper>
    </DialogWrapper>
  );
};

export default ModalPopUp;
