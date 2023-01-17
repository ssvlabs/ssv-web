import React from 'react';
import { observer } from 'mobx-react';
import { KeyStoreFlow, KeyShareFlow } from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows';

export enum Types {
  // eslint-disable-next-line no-unused-vars
  reUpload = 1,
  // eslint-disable-next-line no-unused-vars
  keyShares = 2,
  // eslint-disable-next-line no-unused-vars
  keyStores = 3,
}

const ImportFile = ({ type = Types.keyStores }: { type?: Types }) => {
  
  const renderFlow = () => {
    switch (type) {
      case Types.keyShares:
        return <KeyShareFlow />;
      case Types.keyStores:
        return <KeyStoreFlow />;
      case Types.reUpload:
        return <KeyStoreFlow />;
    }
  };
  
  return renderFlow();
};

export default observer(ImportFile);
