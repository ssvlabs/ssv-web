import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

const UnderLine = styled.div`
  display: flex;
  width: 100%;
  border-bottom: solid 1px #efefef;
  margin-bottom: 20px;
  margin-top: 20px;
`;

export type IDataSection = {
  title?: any,
  name?: any,
  component?: any,
  value?: any,
  divider?: boolean
};

export const buildDataSections = (dataSections: IDataSection[]) => {
  const pStyle = { paddingTop: 5, paddingBottom: 5, marginTop: 0, marginBottom: 0 };
  return dataSections.map((dataSection: IDataSection, dataSectionIndex: number) => {
    return (
      <div style={{ width: '100%' }} key={`data-section-${dataSectionIndex}`}>
        <DataSection
          title={dataSection.title}
        >
          {dataSection.component ? <>{dataSection.component}</> : ''}
          {dataSection.name ? <p style={pStyle}>{dataSection.name}</p> : ''}
          {dataSection.value ? <p style={pStyle}>{dataSection.value}</p> : ''}
        </DataSection>
        {dataSection.divider ? <UnderLine /> : ''}
      </div>
    );
  });
};

type DataSectionProps = {
  title?: string,
  children: any
};

const SectionHeader = styled.div`
  display: flex;
  width: 100%;
  font-weight: bold;
  margin: 0;
  padding-top: 0;
  padding-bottom: 5px;
`;

const DataSection = ({ title, children }: DataSectionProps) => {
  return (
    <>
      {title && (
        <SectionHeader>
          {title}
        </SectionHeader>
      )}
      <Grid container direction="row" justify="space-between" alignItems="center" item xs={12} md={12} spacing={0}>
        {children}
      </Grid>
    </>
  );
};

export default DataSection;
