import { Contract } from 'ethers';
import { action, computed, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import merkleTree from '~app/components/applications/Distribution/assets/merkleTreeTestnet.json';
import { fromWei } from '~root/services/conversions.service';
import { store } from '~app/store';
import { setIsLoading, setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { translations } from '~app/common/config';

/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */

class DistributionTestnetStore extends BaseStore {
  @observable rewardIndex: number = 0;
  @observable claimed: boolean = false;
  @observable userAddress: string = '';
  @observable rewardAmount: number = 0;
  @observable rewardMerkleProof: string[] = [];
  @observable userWithdrawRewards: boolean = false;
  @observable distributionContractInstance: Contract | null = null;

  @action.bound
  async claimRewards() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const contract = this.distributionContract;
      const walletStore: WalletStore = this.getStore('Wallet');
      store.dispatch(setIsLoading(true));
      await contract.methods.claim(
        this.rewardIndex,
        this.userAddress,
        String(this.rewardAmount),
        this.rewardMerkleProof,
      ).send({ from: walletStore.accountAddress })
        .on('receipt', async (receipt: any) => {
          console.log(receipt);
          store.dispatch(setIsLoading(false));
          store.dispatch(setIsShowTxPendingPopup(false));
          this.userWithdrawRewards = true;
          this.claimed = true;
          resolve(true);
        })
        .on('transactionHash', (txHash: string) => {
          store.dispatch(setTxHash(txHash));
          store.dispatch(setIsShowTxPendingPopup(true));
        })
        .on('error', (error: any) => {
          store.dispatch(setIsLoading(false));
          store.dispatch(setMessageAndSeverity({ message: error.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, severity: 'error' }));
          store.dispatch(setIsShowTxPendingPopup(false));
          resolve(false);
        });
    });
  }

  @action.bound
  async cleanState() {
    this.claimed = false;
    this.rewardIndex = 0;
    this.rewardAmount = 0;
    this.userAddress = '';
    this.rewardMerkleProof = [];
    this.userWithdrawRewards = false;
  }

  @action.bound
  async checkIfClaimed() {
    const contract = this.distributionContract;
    // @ts-ignore
    const merkleTreeAddresses = Object.keys(merkleTree.claims);
    const walletStore: WalletStore = this.getStore('Wallet');
    const ownerAddress = merkleTreeAddresses.filter(address => address.toLowerCase() === walletStore.accountAddress.toLowerCase());
    if (!ownerAddress.length) return;
    // @ts-ignore
    const user = merkleTree.claims[ownerAddress[0]];
    if (!user) return;
    this.claimed = await contract.methods.isClaimed(user.index).call();
  }

  @action.bound
  async eligibleForReward() {
    await this.cleanState();
    // @ts-ignore
    const merkleTreeAddresses = Object.keys(merkleTree.claims);
    const walletStore: WalletStore = this.getStore('Wallet');
    merkleTreeAddresses.forEach((address: string) => {
      if (address.toLowerCase() === walletStore.accountAddress.toLowerCase()) {
        // @ts-ignore
        const merkleTreeUser = merkleTree.claims[address];
        this.userAddress = address;
        this.rewardIndex = merkleTreeUser.index;
        this.rewardAmount = merkleTreeUser.amount;
        this.rewardMerkleProof = merkleTreeUser.proof;
      }
    });
  }

  /**
   * Returns instance of Distribution contract
   */
  @computed
  get distributionContract(): Contract {
    if (!this.distributionContractInstance) {
      // const walletStore: WalletStore = this.getStore('Wallet');
      // this.distributionContractInstance = new walletStore.web3.eth.Contract(
      //   config.CONTRACTS.SSV_DISTRIBUTION.ABI,
      //   config.CONTRACTS.SSV_DISTRIBUTION.ADDRESS,
      // );
    }
    return <Contract> this.distributionContractInstance;
  }

  @computed
  get userRewardAmount() {
    // eslint-disable-next-line radix
    return fromWei(parseInt(String(this.rewardAmount)).toString());
  }
}

export default DistributionTestnetStore;
