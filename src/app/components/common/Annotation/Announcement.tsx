import { useState } from 'react';
import styled from 'styled-components';

const AnnouncementWrapper = styled.div`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.primaryError};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: 500;
  justify-content: flex-end;
  padding-right: 20px;
`;

const AttentionIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 12px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/attention/attention.svg);
`;

const CloseButton = styled.div`
  width: 24px;
  height: 24px;
  background-size: contain;
  background-position: center;
  cursor: pointer;
  background-repeat: no-repeat;
  background-image: url(/images/x/white.svg);
  margin-left: 421px;
`;

const Announcement = ({ text }: { text?: string }) => {
  const [showAnnotation, setShowAnnotation] = useState(false);

  const closeAnnotation = () => setShowAnnotation(false);

  if (text && showAnnotation) {
    return (
      <div>
        <AnnouncementWrapper>
          <AttentionIcon />
          {text}
          <CloseButton onClick={closeAnnotation} />
        </AnnouncementWrapper>
      </div>
    );
  } else {
    return null;
  }
};

export default Announcement;
