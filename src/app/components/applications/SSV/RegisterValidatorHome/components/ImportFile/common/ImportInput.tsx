import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useRef } from 'react';
import { useStyles } from '../ImportFile.styles';
import Spinner from '~app/components/common/Spinner';
import styled from 'styled-components';

type Props = {
  fileText: any;
  fileImage?: any;
  fileHandler: any;
  removeButtons?: any;
  extendClass?: string;
  processingFile: boolean;
  processValidatorsCount?: number;
};

const ProcessingValidators = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray40};
`;

const ImportInput = (props: Props) => {
  const { processingFile, fileHandler, fileText, fileImage, removeButtons, extendClass, processValidatorsCount } = props;
  const classes = useStyles({});
  const inputRef = useRef(null);
  const handleClick = (e: any) => {
    if (e.target !== inputRef.current && e.target !== removeButtons?.current) {
      // @ts-ignore
      inputRef.current.click();
    }
  };
  const handleDrag = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (acceptedFiles: any) => {
    acceptedFiles.preventDefault();
    const uploadedFile = acceptedFiles.target?.files ?? acceptedFiles.dataTransfer?.files;
    if (uploadedFile.length > 0) fileHandler(uploadedFile[0]);
  };

  return (
    <Grid container item xs={12} onDrop={handleDrop} onClick={handleClick} onDragOver={handleDrag} className={`${classes.DropZone} ${extendClass}`}>
      <input type="file" className={classes.Input} ref={inputRef} onChange={handleDrop} />
      {!processingFile && fileImage && fileImage()}
      {!processingFile && fileText()}
      {processingFile && (
        <Grid container item>
          <Grid item style={{ margin: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <Spinner size={48} />
            {!!processValidatorsCount && <ProcessingValidators>Processing {processValidatorsCount} validators...</ProcessingValidators>}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default observer(ImportInput);
