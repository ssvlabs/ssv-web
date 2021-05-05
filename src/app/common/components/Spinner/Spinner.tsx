import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const SpinnerMessage = styled.div`
  width: 100%;
  display: block;
  margin: auto;
  text-align: center;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-content: center;
  align-items: center;
`;

const CircularProgressContainer = styled.div`
  display: flex;
  margin: auto;
`;

const Progress = styled(CircularProgress)`
    margin: auto;
`;

type SpinnerProps = {
    message?: string
};

const Spinner = ({ message }: SpinnerProps) => {
    return (
      <SpinnerWrapper>
        <CircularProgressContainer>
          <Progress />
        </CircularProgressContainer>
        {message && (
          <SpinnerMessage>
            {message}
            <br />
          </SpinnerMessage>
        )}
      </SpinnerWrapper>
    );
};

export default Spinner;
