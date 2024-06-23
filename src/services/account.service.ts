import config from '~app/common/config';
import { getRequest, postRequest } from '~root/services/httpApi.service';
import { utils } from 'ethers';
import { getContractByName } from '~root/wagmi/utils';
import { EContractName } from '~app/model/contracts.model';
import notifyService from '~root/services/notify.service';
import { store } from '~app/store';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';

const getAccountData = async (publicKey: string) => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/accounts/${utils.getAddress(publicKey)}`;
    return await getRequest(url);
  } catch (e) {
    return null;
  }
};

const getOwnerNonce = async ({ address }: { address: string }) => {
  const res = await getAccountData(address);
  if (res.data && (res.data.nonce || res.data.nonce === 0)) {
    return Number(res.data.nonce);
  }
  return undefined;
};

const setFeeRecipient = async ({ feeRecipientAddress, isContractWallet }: { feeRecipientAddress: string; isContractWallet: boolean }) => {
  const contract = getContractByName(EContractName.SETTER);
  try {
    const tx = await contract.setFeeRecipientAddress(feeRecipientAddress);
    if (tx.hash) {
      notifyService.hash(tx.hash);
      store.dispatch(setTxHash(tx.hash));
      store.dispatch(setIsShowTxPendingPopup(true));
    }
    if (isContractWallet) {
      return true;
    }
    await tx.wait();
  } catch (e: any) {
    // TODO: add error handling
    console.error(`Error during setting fee recipient: ${e.message}`);
  } finally {
    if (!isContractWallet) {
      store.dispatch(setIsShowTxPendingPopup(false));
    }
  }
};

const getFeeRecipientAddress = async ({ address }: { address: string }) => {
  const res = await getAccountData(address);
  if (res && res.data.recipientAddress) {
    return res.data.recipientAddress;
  } else {
    // TODO: add error handling
    return '';
  }
};

const postTermsAndConditions = async (address: string) => {
  const url = `${String(config.links.SSV_API_ENDPOINT)}/terms/create`;
  return await postRequest(url, { ownerAddress: address });
};

export { getAccountData, getOwnerNonce, setFeeRecipient, getFeeRecipientAddress, postTermsAndConditions };
