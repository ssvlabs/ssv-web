import React, { useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import LinkText from '~app/components/common/LinkText/LinkText';
import MigrationStore from '~app/common/stores/applications/SsvWeb/Migration.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import { useStyles } from '~app/components/applications/SSV/Migration/UploadMigrationFile/UploadMigrationFile.styles';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common/ImportInput';

const UploadMigrationFile = ({ nextStep }: { nextStep: Function }) => {
    const stores = useStores();
    const migrationStore: MigrationStore = stores.Migration;
    const classes = useStyles();
    const removeButtons = useRef(null);
    const migrationFileIsJson = migrationStore.isJsonFile(migrationStore.migrationFile);
    const [processFile, setProcessFile] = useState(false);
    const [validationError, setValidationError] = useState({ id: 0, errorMessage: '', subErrorMessage: '' });
    const disableBtnCondition = !migrationStore.migrationFile || validationError.id !== 0 || processFile;

    const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.Remove}>Remove</Grid>;

    const removeFile = () => {
        setProcessFile(true);
        migrationStore.removeMigrationFile();
        setValidationError({ id: 0, errorMessage: '', subErrorMessage: '' });
        setProcessFile(false);

        try {
            // @ts-ignore
            inputRef.current.value = null;
        } catch (e: any) {
            console.log(e.message);
        }
    };

    const renderFileText = () => {
        if (!migrationStore.migrationFile) {
            return (
                <Grid item xs={12} className={classes.FileText}>
                    Drag and drop files or <LinkText text={'browse'}/>
                </Grid>
            );
        }
        if (validationError.id !== 0) {
            return (
                <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
                    {validationError.errorMessage}
                    {validationError.subErrorMessage && <Grid item>{validationError.subErrorMessage}</Grid>}
                    <RemoveButton/>
                </Grid>
            );
        }
        if (!migrationFileIsJson) {
            return (
                <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
                    Invalid file format - only .json files are supported
                    <RemoveButton/>
                </Grid>
            );
        }
        if (migrationFileIsJson) {
            return (
                <Grid item xs={12} className={`${classes.FileText} ${classes.SuccessText}`}>
                    {migrationStore.migrationFile.name}
                    <RemoveButton/>
                </Grid>
            );
        }
    };

    const fileHandler = async (file: File) => {
        setProcessFile(true);
        migrationStore.setMigrationFile(file, async () => {
            const errorResponse: any = await migrationStore.validateMigrationFile();
            setValidationError(errorResponse);
            setProcessFile(false);
        });
    };

    const renderFileImage = () => {
        let fileClass: any = classes.FileImage;
        if (validationError.id !== 0) {
            fileClass += ` ${classes.Fail}`;
        } else if (migrationFileIsJson) {
            fileClass += ` ${classes.Success}`;
        } else if (!migrationFileIsJson  && migrationStore.migrationFile) {
            fileClass += ` ${classes.Fail}`;
        }
        return <Grid item className={fileClass}/>;
    };

    return (
        <BorderScreen
            sectionClass={classes.ExtendWrapper}
            wrapperClass={classes.CustomWrapper}
            body={[
                <Grid className={classes.MigrationWrapper}>
                    <Typography className={classes.Title}>
                        Enter Migration File
                    </Typography>
                    <Typography className={classes.Text}>
                        Upload the migration file that you generated on the Blox Live app
                    </Typography>
                    <ImportInput
                        extendClass={classes.FileInputExtendClass}
                        fileText={renderFileText}
                        fileHandler={fileHandler}
                        fileImage={renderFileImage}
                        removeButtons={removeButtons}
                        processingFile={processFile}
                    />
                    <PrimaryButton disable={disableBtnCondition} text={'Next'} submitFunction={nextStep} />
                </Grid>,
            ]}
        />
    );
};

export default UploadMigrationFile;