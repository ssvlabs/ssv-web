import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import AppLinkOption from './AppLinkOption';
import { useStyles } from '~app/components/common/AppLinksToggle/AppLinksToggle.styles';
import SocialNetworkLinks from '~app/components/common/AppLinksToggle/SocialNetworkLinks';

type ToggleOptionModel = {
    label: string,
    link: string,
    bottomLine: boolean
};

type ToggleSelectProps = {
    options: ToggleOptionModel[]
};

const AppLinksToggle = ({ options }: ToggleSelectProps) => {
    const classes = useStyles({});
    const optionsRef = useRef(null);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => {
            setTimeout(() => {
                if (showOptions) {
                setShowOptions(false);
            }}, 200);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [optionsRef, showOptions]);

    const switchShowOptions = () => {
        showOptions ? setShowOptions(false) : setShowOptions(true);
    };

    return (
        <Grid className={classes.ToggleWrapper} onClick={switchShowOptions}>
            <Grid className={classes.DotsGroupWrapper}>
                <Grid className={classes.DotsGroup}/>
            </Grid>
            {showOptions && <Grid item className={classes.OptionsWrapper}>
                <Grid ref={optionsRef}  container item className={classes.Options}>
                    {options.map((option:ToggleOptionModel) => <AppLinkOption bottomLine={option.bottomLine} key={option.label} optionLabel={option.label} link={option.link}/>) }
                    <SocialNetworkLinks />
                </Grid>
            </Grid>}
        </Grid>
    );
};

export default AppLinksToggle;
