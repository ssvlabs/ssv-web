import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

type DataSectionProps = {
    title?:string,
    children: any
    withTitle: boolean
};

const SectionHeader = styled.div`
  display: flex;
  width: 100%;
  font-weight: bold;
`;

const DataSection = ({ withTitle, title, children }: DataSectionProps) => {
    return (
      <>
        {withTitle && (
        <SectionHeader>
          {title}
        </SectionHeader>
        )}
        <Grid container direction="row" justify="space-between" alignItems="center" item xs={12} spacing={1}>
          {children}
        </Grid>
      </>
    );
};

export default DataSection;