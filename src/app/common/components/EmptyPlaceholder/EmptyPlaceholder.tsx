import React from 'react';

const EmptyPlaceholder = ({ height }: { height: number }) => {
  return (
    <div style={{ minHeight: height }} />
  );
};

export default EmptyPlaceholder;
