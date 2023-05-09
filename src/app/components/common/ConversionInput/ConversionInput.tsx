import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
// import IntegerInput from '~app/components/common/IntegerInput';
import { useStyles } from '~app/components/common/ConversionInput/ConversionInInput.styles';
import TextInput from '~app/components/common/TextInput';
import Typography from '@mui/material/Typography';

type ConversionInputProps = {
    value: string | number;
};
const ConversionInput = ({ value } : ConversionInputProps) => {
    const classes = useStyles();
    const [coins] = useState(['SSV', 'USD']);
    const [currency, setCurrency] = useState('SSV');
    const switchCurrency = (selectedCurrency: string) => {
        setCurrency(selectedCurrency);

    };
    return (
        <Grid container style={{ gap: 10 }}>
            <Grid container style={{ gap: 16 }} className={classes.InputAdditionalDataWrapper}>
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
                       placeHolder={'0'}
                       onChangeCallback={() => null}
                       withSideText />
        </Grid>
    );
};

export default ConversionInput;