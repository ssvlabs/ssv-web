import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextInput from '~app/components/common/TextInput';
import { useStyles } from '~app/components/common/ConversionInput/ConversionInInput.styles';

export type ErrorType = {
    shouldDisplay: boolean;
    errorMessage: string;
};

type ConversionInputProps = {
    error?: ErrorType;
    onChange: Function;
    value: string | number;
    placeholder?: string
};
const ConversionInput = ({ value, onChange, error, placeholder } : ConversionInputProps) => {
    const classes = useStyles();
    const [coins] = useState(['SSV', 'USD']);
    const [currency, setCurrency] = useState('SSV');

    const switchCurrency = (selectedCurrency: string) => {
        setCurrency(selectedCurrency);
    };

    return (
        <Grid container style={{ height: '101px', gap: 10 }}>
            <Grid container className={classes.InputAdditionalDataWrapper}>
                <Typography className={classes.AnnualFeeLabel}>Annual fee</Typography>
                <Grid container item className={classes.Conversion}>
                    {coins.map((coin: string, index: number) => {
                        return (
                            <Grid key={index} item xs={6}
                                  className={`${classes.Currency} ${currency === coin && classes.SelectedCurrency}`}
                                  onClick={() => {
                                      switchCurrency(coin);
                                  }}>{coin}</Grid>
                        );
                    })}
                </Grid>
            </Grid>
            <TextInput value={value}
                       extendClass={classes.FeeInput}
                       sideText={currency}
                       placeHolder={placeholder}
                       onChangeCallback={onChange}
                       withSideText />
            <Grid container className={classes.TextErrorWrapper}><Typography className={classes.TextError}>{`${error?.errorMessage}`}</Typography></Grid>
        </Grid>
    );
};

export default ConversionInput;