import { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { truncateText } from '~lib/utils/strings';
import { useStyles } from '~app/components/common/DynamicTextArea/DynamicTextArea.style';
import { selectMetadataValueByName, setMetadataValue } from '~app/redux/operatorMetadata.slice.ts';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper.ts';

const DynamicTextarea = ({ fieldKey }: { fieldKey: FIELD_KEYS }) => {
  const dispatch = useAppDispatch();
  const description = useAppSelector((state) => selectMetadataValueByName(state, fieldKey));
  const [value, setValue] = useState<string>(description);
  const [showingValue, setShowingValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fieldHeight, setFieldHeight] = useState<string | number>(80);
  const [amountOfField, setAmountOfField] = useState<number>(1);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      setMetadataValue({
        metadataFieldName: fieldKey,
        value: event.target.value
      })
    );
    setValue(event.target.value);
    setShowingValue(event.target.value);
  };

  const handleBlur = () => {
    setShowingValue(truncateText(value, 100));
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      setFieldHeight(80);
    }
  };

  const handleFocus = () => {
    setShowingValue(value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      if (textareaRef.current.scrollHeight < 80) {
        textareaRef.current.style.height = 'auto';
        setAmountOfField(1);
        setFieldHeight(80);
      } else {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        setAmountOfField(2);
        setFieldHeight(textareaRef.current.scrollHeight);
      }
    }
  }, [value]);

  useEffect(() => {
    setShowingValue(truncateText(value, 100));
    setFieldHeight(80);
  }, []);

  const classes = useStyles({ areaHeight: fieldHeight });

  return (
    <Grid container className={classes.Wrapper}>
      <textarea
        rows={amountOfField}
        className={classes.TextArea}
        ref={textareaRef}
        value={showingValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={{ overflow: 'hidden' }}
        placeholder={'Describe your operation'}
      />
    </Grid>
  );
};

export default DynamicTextarea;
