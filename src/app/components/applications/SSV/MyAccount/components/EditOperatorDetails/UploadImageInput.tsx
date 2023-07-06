import React, { useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText/LinkText';
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
    const [currentData, setCurrentData] = useState(metadataStore.getMetadata(fieldKey));
    const removeButtons = useRef(null);

    const fileHandler = (file: any) => {
        const newData = metadataStore.getMetadata(fieldKey);
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg'];
        if (!allowedTypes.includes(file.type)) {
            newData.errorMessage = 'File must be .jpg .jpeg .png .svg';
            setCurrentData(newData);
            metadataStore.setMetadata(fieldKey, newData);
            return;
        }
        if ((file.size / 1024) > 200) {
            newData.errorMessage = 'File must be up to 200KB';
            setCurrentData(newData);
            metadataStore.setMetadata(fieldKey, newData);
            return;
        }
        newData.errorMessage = '';
        const reader = new FileReader();
        reader.onloadend = function (e) {
            if (e?.target?.readyState === FileReader.DONE && !newData.errorMessage) {
                const base64ImageString = e.target.result;
                newData.value = base64ImageString!.toString();
                newData.imageFileName = file.name;
                metadataStore.setMetadata(fieldKey, newData);
                setCurrentData(newData);
            }
        };
        reader.readAsDataURL(file);
    };

    const removeFile = () => {
        setCurrentData(prevState => {
            prevState.errorMessage = '';
            prevState.imageFileName = '';
            prevState.value = '';
            return prevState;
        });
        metadataStore.setMetadata(fieldKey, currentData);
    };

    const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.RemoveIcon} />;

    // TODO: add drop icon
    const renderFileText = () => {
        if (currentData.imageFileName) {
           return (<Typography className={classes.ImageName}>{currentData.imageFileName} {currentData.errorMessage} <RemoveButton/></Typography>);
        }
        if (currentData.errorMessage) {
           return (<Typography className={classes.ImageErrorMessage}>{currentData.errorMessage} <RemoveButton/></Typography>);
        }
        return (
            <Grid item xs={12} className={classes.FileText}>
                   Drop file here or <LinkText text={'browse'}/> Max size: 200KB (JPG, PNG,SVG)
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
