import React, { useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText/LinkText';
import { photoValidation } from '~lib/utils/operatorMetadataHelper';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import ImportInput
    from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common/ImportInput';
import {
    useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';

const UploadImageInput = ({ fieldKey, extendClass } : { fieldKey: string, extendClass?: string }) => {
    const classes = useStyles();
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const [currentData, setCurrentData] = useState(metadataStore.getMetadataEntity(fieldKey));
    const removeButtons = useRef(null);


    const updateCurrentData = (base64ImageString: string, fileName: string, errorMessage: string) => {
        const newData = metadataStore.getMetadataEntity(fieldKey);
        newData.value = base64ImageString!.toString();
        newData.imageFileName = fileName;
        newData.errorMessage = errorMessage;
        metadataStore.setMetadataEntity(fieldKey, newData);
        setCurrentData(newData);
    };

    const fileHandler = (file: any) => {
        photoValidation(file, updateCurrentData);
    };

    const removeFile = () => {
        setCurrentData(prevState => {
            prevState.errorMessage = '';
            prevState.imageFileName = '';
            prevState.value = '';
            return prevState;
        });
        metadataStore.setMetadataEntity(fieldKey, currentData);
    };

    const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.RemoveIcon} />;
    
    const renderFileText = () => {
        if (currentData.imageFileName && !currentData.errorMessage) {
           return (<Typography className={classes.ImageName}>{currentData.imageFileName} <RemoveButton/></Typography>);
        }
        if (currentData.errorMessage) {
           return (<Typography className={classes.ImageErrorMessage}>{currentData.errorMessage} <RemoveButton/></Typography>);
        }
        return (
            <Grid item xs={12} className={classes.FileText}>
                   Drop file here or <LinkText text={'browse'}/> Max size: 200KB (JPG, JPEG, PNG)
            </Grid>
        );
    };

    return (
        <ImportInput
        fileText={renderFileText}
        fileHandler={fileHandler}
        removeButtons={removeButtons}
        processingFile={false}
        extendClass={extendClass}
    /> );
};

export default UploadImageInput;
