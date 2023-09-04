import React from 'react';
import Typography from '@mui/material/Typography';
import WarningBox from '~app/components/common/WarningBox';
import LinkText from '~app/components/common/LinkText/LinkText';
import { useStyles } from '~app/components/common/Depreciation/Deprecation.styles';

const Deprecation = () => {
    const classes = useStyles();

    return (
        <WarningBox
            width={641}
            height={119}
            text={
                <Typography className={classes.DeprecationText}>
                    Jato-V2 Testnet is now live! Please take note that Jato-V1 is scheduled to be deprecated on
                    September 18th. <LinkText link={'https://ssv.network/blog/technology/migrating-to-Jato-v2'}
                                              extendClassName={classes.DeprecationText} text={'Read more'}/> to discover
                    how to migrate to the new testnet and for further details. <LinkText link={'beta.app.ssv.network'}
                                                                                         extendClassName={classes.DeprecationText}
                                                                                         text={'Try out Jato-v2.'}/>
                </Typography>}
        />
    );
};

export default Deprecation;
