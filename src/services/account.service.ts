import config from '~app/common/config';
import { getRequest } from '~root/services/httpApi.service';
import { web3 } from 'ssv-keys/dist/tsc/src/lib/helpers/web3.helper';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import notifyService from '~root/services/notify.service';
import { store } from '~app/store';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';

const getAccountData = async (publicKey: string) => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/accounts/${web3.utils.toChecksumAddress(publicKey)}`;
    return await getRequest(url);
  } catch (e) {
    return null;
  }
};

const getOwnerNonce = async ({ address }: { address: string }) => {
  const res = await getAccountData(address);
  console.log(res);
  if (res.data && (res.data.nonce || res.data.nonce === 0)) {
    console.log(res.data.nonce);
    return Number(res.data.nonce);
  }
  return undefined;
};

const setFeeRecipient = async ({ feeRecipientAddress }: { feeRecipientAddress: string }) => {
  const contract = getContractByName(EContractName.SETTER);
  try {
    const tx = await contract.setFeeRecipientAddress(feeRecipientAddress);
    if (tx.hash) {
      notifyService.hash(tx.hash);
      store.dispatch(setTxHash(tx.hash));
      store.dispatch(setIsShowTxPendingPopup(true));
    }
    await tx.wait();
  } catch (e: any) {
    // TODO: add error handling
    console.error(`Error during setting fee recipient: ${e.message}`);
  } finally {
    store.dispatch(setIsShowTxPendingPopup(false));
  }
};

const getFeeRecipientAddress = async ({ address }: { address: string })=> {
  const res = await getAccountData(address);
  if (res && res.recipientAddress) {
    return res.recipientAddress;
  } else {
    // TODO: add error handling
    return '';
  }
};

export { getAccountData, getOwnerNonce, setFeeRecipient, getFeeRecipientAddress };
