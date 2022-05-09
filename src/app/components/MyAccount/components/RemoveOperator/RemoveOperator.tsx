import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import CheckBox from '~app/common/components/CheckBox';
import LinkText from '~app/common/components/LinkText';
import TextInput from '~app/common/components/TextInput';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import PrimaryButton from '~app/common/components/Button/PrimaryButton';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/MyAccount/components/RemoveOperator/RemoveOperator.styles';

const RemoveOperator = () => {
    const stores = useStores();
    const history = useHistory();
    history;
    // @ts-ignore
    const { operator_id } = useParams();
    const [operator, setOperator] = useState(null);
    const [checkbox, setCheckBox] = useState(false);
    const [leavingReason, setLeavingReason] = useState(0);
    const [userTextReason, setUserTextReason] = useState('');
    const classes = useStyles({ leavingReason });
    const operatorStore: OperatorStore = stores.Operator;
    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        applicationStore.setIsLoading(true);
        Operator.getInstance().getOperator(operator_id).then((response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    const chooseReason = (reason: number) => {
        if (leavingReason === reason) {
            setCheckBox(false);
            setLeavingReason(0);
        } else {
            setLeavingReason(reason);
        }
    };

    const inputHandler = (e: any) => {
        const userInput = e.target.value;
        setUserTextReason(userInput);
    };

    const ShareWithUsText = () => {
        switch (leavingReason) {
            case 1:
                return (
                  <Grid item className={classes.ShareWithUsBulletsPoints}>
                    <ul>
                      <li>Visit <LinkText text={'our documentation'} link={'blat'} /> for common node
                        troubleshooting.
                      </li>
                      <li>Consult with other experiences operators in our <LinkText
                        text={'discord developer community'} link={'blat'} />.
                      </li>
                    </ul>
                  </Grid>
                );
            case 2:
                return (
                  <Grid item className={classes.ShareWithUsBulletsPoints}>
                    <ul>
                      <li>Business is slow? Increase your traction and reputation by <LinkText
                        text={'becoming a verified operator.'} link={'blat'} />
                      </li>
                      <li>Costs are too high? See our guides on how to <LinkText text={'optimize hosting costs.'}
                        link={'blat'} />
                      </li>
                    </ul>
                  </Grid>
                );
            default:
                return null;
        }
    };

    const shareWithUs = () => {
        if (leavingReason === 0) return null;

        return (
          <Grid container item className={classes.ShareWithUsWrapper}>
            <ShareWithUsText />
            <TextInput
              disable={false}
              value={userTextReason}
              data-testid="leaving reason"
              onChangeCallback={inputHandler}
              wrapperClass={classes.InputWrapper}
              placeHolder={'Share with us what went wrong'}
            />
          </Grid>
        );
    };

    const checkboxHandler = () => {
      setCheckBox(!checkbox);
    };

    const submitForm = async () => {
        console.log('before');
        const isRemoved = await operatorStore.removeOperator(operator_id);
        if (isRemoved) history.push(`/dashboard/operator/${operator_id}/removed`);
        console.log(userTextReason);
    };

    // @ts-ignore
    const { address } = operator || {};

    if (!operator) return null;

    return (
      <Grid container item>
        <WhiteWrapper header={'Remove Operator'}>
          <Grid item container className={classes.HeaderWrapper}>
            <Typography className={classes.Address}>{address}</Typography>
            <ImageDiv image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
            <ImageDiv image={'beacon'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>
        <Grid className={classes.BodyWrapper}>
          <BorderScreen
            blackHeader
            withoutNavigation
            header={'Removing your operator will:'}
            body={[
              <Grid container item>
                <Grid item className={classes.BulletsWrapper}>
                  <ul>
                    <li>Terminate operation of all your managed validators, which will reduce their fault tolerance and put them at risk.</li>
                    <li>Immediately stop receiving future earnings from validators operation.</li>
                    <li>Remove yourself from the network and you will not longer be discoverable by other validators.</li>
                    <li>Will delete all validators keyshares from your operator node.</li>
                  </ul>
                </Grid>
                <Grid item className={classes.Notice}>
                  Please note that this process is irreversible and you would not be able to reactive this operator in the future.
                </Grid>
                <Typography className={classes.TextHelper}>Help us understand why you are leaving:</Typography>
                <Grid container item className={classes.BoxesWrapper}>
                  <Grid item container className={classes.BoxWrapper} onClick={() => { chooseReason(1); }}>
                    <Grid item className={classes.TechnicalImage} xs={12}></Grid>
                    Technical Issues
                  </Grid>
                  <Grid item container className={classes.BoxWrapper} onClick={() => { chooseReason(2); }}>
                    <Grid item className={classes.ProfitabilityImage} xs={12}></Grid>
                    Low profitability
                  </Grid>
                  <Grid item container className={classes.BoxWrapper} onClick={() => { chooseReason(3); }}>
                    <Grid item className={classes.OtherImage} xs={12}></Grid>
                    Other
                  </Grid>
                </Grid>
                {shareWithUs()}
                {leavingReason !== 0 && (
                  <CheckBox onClickCallBack={checkboxHandler}
                    text={'I understand that by removing my operator I am potentially putting all of my managed validators at risk.'} />
                  )}

                <PrimaryButton disable={!checkbox || leavingReason === 0} errorButton text={'Submit & Remove'} submitFunction={submitForm} />
              </Grid>,
            ]}
          />
        </Grid>
      </Grid>
    );
};

export default observer(RemoveOperator);