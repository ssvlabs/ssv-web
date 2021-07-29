import React, { useState } from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import faq from './components/faq';

const UpgradeFAQContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const UpgradeFAQItem = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #20EEC8;
  border-radius: 6px;
  margin-top: 15px;
  padding: 15px;
`;

const UpgradeFAQHeader = styled.div`
  display: flex;
  padding: 0;
  margin: 0;
  width: 100%;
  font-style: normal;
  font-weight: 900;
  font-size: 18px;
  color: #5B6C84;
  cursor: pointer;
  align-content: center;
  align-items: center;
`;

const UpgradeFAQContent = styled.div<{ expanded: boolean }>`
  display: ${({ expanded }) => expanded ? 'initial' : 'none'};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #5B6C84;
  padding-top: 15px;
`;

const UpgradeFAQTitle = styled.div`
  display: block;
  width: 100%;
  text-align: center;
  font-style: normal;
  font-weight: 900;
  font-size: 28px;
  color: #20EEC8;
  margin-top: 50px;
`;

const UpgradeFAQIconIndicator = styled.div`
  display: inline;
  margin-right: 5px;
  margin-left: auto;
  margin-top: 5px;
`;

const UpgradeFAQ = () => {
  const defaultExpanded: any = {};
  const [expanded, setExpanded] = useState(defaultExpanded);
  const iconStyle = { fontSize: 35, color: '#A1ACBE' };

  return (
    <UpgradeFAQContainer>
      <UpgradeFAQTitle>FAQ</UpgradeFAQTitle>

      {faq.map((faqItem, faqIndex) => (
        <UpgradeFAQItem key={`faq-${faqIndex}`}>
          <UpgradeFAQHeader onClick={() => {
            setExpanded({ ...expanded, [faqIndex]: !expanded[faqIndex] });
          }}>
            {faqItem.question}
            <UpgradeFAQIconIndicator>
              {expanded[faqIndex] ? <ExpandLessIcon style={iconStyle} /> : <ExpandMoreIcon style={iconStyle} />}
            </UpgradeFAQIconIndicator>
          </UpgradeFAQHeader>
          <UpgradeFAQContent expanded={expanded[faqIndex]}>
            {faqItem.answer}
          </UpgradeFAQContent>
        </UpgradeFAQItem>
      ))}
    </UpgradeFAQContainer>
  );
};

export default UpgradeFAQ;
