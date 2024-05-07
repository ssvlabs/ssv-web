import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import  { useRef } from 'react';
import { useStyles } from '../ImportFile.styles';
import Spinner from '~app/components/common/Spinner';

type Props = {
  fileText: any,
  fileImage?: any,
  fileHandler: any,
  removeButtons?: any,
  extendClass?: string,
  processingFile: boolean,
};

const ImportInput = (props: Props) => {
  const { processingFile, fileHandler, fileText, fileImage, removeButtons, extendClass } = props;
  const classes = useStyles();
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
      <Grid
          container
          item xs={12}
          onDrop={handleDrop}
          onClick={handleClick}
          onDragOver={handleDrag}
          className={`${classes.DropZone} ${extendClass}`}
      >
        <input type="file" className={classes.Input} ref={inputRef} onChange={handleDrop}/>
        {!processingFile && fileImage && fileImage()}
        {!processingFile && fileText()}
        {processingFile && (
            <Grid container item>
              <Grid item style={{ margin: 'auto' }}>
                <Spinner/>
              </Grid>
            </Grid>
        )}
      </Grid>
  );
};

export default observer(ImportInput);
