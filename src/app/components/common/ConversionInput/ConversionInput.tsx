import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextInput from '~app/components/common/TextInput';
import { useStyles } from '~app/components/common/ConversionInput/ConversionInInput.styles';

export type ErrorType = {
    errorMessage: string;
    shouldDisplay: boolean;
};

type ConversionInputProps = {
    error?: ErrorType;
    onChange: Function;
    placeholder?: string
    setCurrency: Function
    value: string | number;
};

const ConversionInput = ({ value, onChange, error, placeholder, setCurrency } : ConversionInputProps) => {
    const classes = useStyles();
    const [coins] = useState(['SSV', 'USD']);
    const [currentCurrency, setCurrentCurrency] = useState('SSV');

    const switchCurrency = (selectedCurrency: string) => {
        setCurrency(selectedCurrency);
        setCurrentCurrency(selectedCurrency);
    };

    return (
        <Grid container style={{ height: '101px', gap: 10 }}>
            <Grid container className={classes.InputAdditionalDataWrapper}>
                <Typography className={classes.AnnualFeeLabel}>Annual fee</Typography>
                {false && <Grid container item className={classes.Conversion}>
                    {coins.map((coin: string, index: number) => {
                        return (
                            <Grid key={index} item xs={6}
                                  className={`${classes.Currency} ${currentCurrency === coin && classes.SelectedCurrency}`}
                                  onClick={() => {
                                      switchCurrency(coin);
                                  }}>{coin}</Grid>
                        );
                    })}
                </Grid>}
            </Grid>
            <TextInput value={value}
                       extendClass={`${classes.FeeInput} ${error?.shouldDisplay && classes.errorInputBorder}`}
                       sideText={currentCurrency}
                       placeHolder={placeholder}
                       onChangeCallback={onChange}
                       withSideText />
            <Grid container className={classes.TextErrorWrapper}><Typography className={classes.TextError}>{`${error?.errorMessage}`}</Typography></Grid>
        </Grid>
    );
};

export default ConversionInput;