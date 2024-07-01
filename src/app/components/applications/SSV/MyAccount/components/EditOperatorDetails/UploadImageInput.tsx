import { useRef } from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { truncateText } from '~lib/utils/strings';
import LinkText from '~app/components/common/LinkText/LinkText';
import { FIELD_KEYS, photoValidation } from '~lib/utils/operatorMetadataHelper';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common/ImportInput';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { selectMetadataEntityByName, setMetadataEntity } from '~app/redux/operatorMetadata.slice.ts';

const UploadImageInput = ({ fieldKey, extendClass }: { fieldKey: FIELD_KEYS; extendClass?: string }) => {
  const classes = useStyles();
  const currentData = useAppSelector((state) => selectMetadataEntityByName(state, fieldKey));
  const removeButtons = useRef(null);
  const dispatch = useAppDispatch();

  const updateCurrentData = (base64ImageString: string, fileName: string, errorMessage: string) => {
    dispatch(setMetadataEntity({ metadataFieldName: fieldKey, value: { ...currentData, value: base64ImageString!.toString(), imageFileName: fileName, errorMessage } }));
  };

  const fileHandler = (file: File) => {
    photoValidation(file, updateCurrentData);
  };

  const removeFile = () => {
    dispatch(setMetadataEntity({ metadataFieldName: fieldKey, value: { ...currentData, errorMessage: '', imageFileName: '', value: '' } }));
  };

  const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.RemoveIcon} />;

  const renderFileText = () => {
    if (currentData.imageFileName && !currentData.errorMessage) {
      return (
        <Typography className={classes.ImageName}>
          {truncateText(currentData.imageFileName, 50)} <RemoveButton />
        </Typography>
      );
    }
    if (currentData.errorMessage) {
      return (
        <Typography className={classes.ImageErrorMessage}>
          {currentData.errorMessage} <RemoveButton />
        </Typography>
      );
    }
    return (
      <Grid item xs={12} className={classes.FileText}>
        Drop file here or <LinkText text={'browse'} /> Max size: 200KB (JPG, JPEG, PNG)
      </Grid>
    );
  };

  return <ImportInput fileText={renderFileText} fileHandler={fileHandler} removeButtons={removeButtons} processingFile={false} extendClass={extendClass} />;
};

export default UploadImageInput;
