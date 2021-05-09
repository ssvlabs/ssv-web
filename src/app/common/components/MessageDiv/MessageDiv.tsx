import React from 'react';
import { Alert } from '@material-ui/lab';
import { observer } from 'mobx-react';

type MessageDivProps ={
    text: string
};
const MessageDiv = ({ text }: MessageDivProps) => {
    return (
      <Alert icon={false} severity="error">
        {text}
      </Alert>
    );
};

export default observer(MessageDiv);
