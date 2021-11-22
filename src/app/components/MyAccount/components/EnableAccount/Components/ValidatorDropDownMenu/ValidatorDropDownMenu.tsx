import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { getImage } from '~lib/utils/filePath';
import NameAndAddress from '~app/common/components/NameAndAddress';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import { useStyles } from './ValidatorDropDownMenu.styles';

type Props = {
    validator: any,
};

const ValidatorDropDownMenu = (props: Props) => {
    const { validator } = props;
    const classes = useStyles();
    const [dropMenu, setDropMenu] = useState(false);
    const [operators, setOperators]: any = useState([]);

    useEffect(() => {
        console.log(validator);
        setOperators([
            { name: 'OperatorName1', pubkey: '0xfb74...c77f', fee: '76' },
            { name: 'OperatorName2', pubkey: '0xfb74...c77f', fee: '76' },
            { name: 'OperatorName3', pubkey: '0xfb74...c77f', fee: '76' },
            { name: 'OperatorName4', pubkey: '0xfb74...c77f', fee: '76' },
        ]);
    }, []);

    return (
      <Grid className={classes.DropDownWrapper} item container onClick={() => {
            setDropMenu(!dropMenu);
        }}>
        <Grid item className={`${classes.ArrowDown} ${dropMenu ? classes.ArrowUp : ''}`}><img
          src={getImage('arrow_up_icon.svg')} /></Grid>
        <Grid item><NameAndAddress address={validator.pubkey} name={validator.name} /></Grid>
        <Grid item xs><SsvAndSubTitle ssv={'276'} subText={'/year'} /></Grid>
        {dropMenu && (
        <Grid container item xs={12} className={classes.OperatorsWrapper}>
          {operators.map((operator: any, index: number) => {
                        return (
                          <Grid key={index} item container xs={12} className={classes.OperatorWrapper}>
                            <Grid item><NameAndAddress address={operator.pubkey} name={operator.name} /></Grid>
                            <Grid item xs><SsvAndSubTitle ssv={operator.fee} subText={'/year'} /></Grid>
                          </Grid>
                        );
          })}
        </Grid>
            )}
      </Grid>
    );
};

export default ValidatorDropDownMenu;