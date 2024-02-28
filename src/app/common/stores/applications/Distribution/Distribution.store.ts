import { action, computed, observable } from 'mobx';
import { equalsAddresses } from '~lib/utils/strings';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import NotificationsStore from '~app/common/stores/applications/Distribution/Notifications.store';
import { IMerkleTreeData } from '~app/model/merkleTree.model';
import { fromWei } from '~root/services/conversions.service';
import { store } from '~app/store';
import { setIsLoading, setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { fetchMerkleTreeStructure } from '~root/services/distribution.service';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';

class DistributionStore extends BaseStore {
  @observable merkleRoot: string = '';
  @observable userAddress: string = '';
  @observable rewardIndex: number = 0;
  @observable rewardAmount: number = 0;
  @observable claimed: boolean = false;
  @observable claimedRewards: number = 0;
  @observable rewardMerkleProof: string[] = [];
  @observable userWithdrawRewards: boolean = false;

  @action.bound
  async claimRewards() {
    return new Promise(async (resolve) => {
      const contract = getContractByName((EContractName.DISTRIBUTION));
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      store.dispatch(setIsLoading(true));
      try {
        const tx = await contract.claim(
          this.userAddress,
          String(this.rewardAmount),
          this.merkleRoot,
          this.rewardMerkleProof,
        );
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        await tx.wait();
        this.userWithdrawRewards = true;
        this.claimed = true;
        resolve(true);
      } catch (error: any) {
        notificationsStore.showMessage(error.message, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  @action.bound
  async cumulativeClaimed() {
    return new Promise(async (resolve) => {
      const contract = getContractByName(EContractName.DISTRIBUTION);
      const result = await contract.cumulativeClaimed(this.userAddress)();
      this.claimedRewards = Number(fromWei(parseInt(String(result)).toString()));
      resolve(this.claimedRewards);
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
  async eligibleForReward() {
    await this.cleanState();
    const merkle = await fetchMerkleTreeStructure();
    const walletStore: WalletStore = this.getStore('Wallet');
      merkle?.tree.data.forEach((merkleTreeUser: IMerkleTreeData, index: number) => {
      if (equalsAddresses(merkleTreeUser.address, walletStore.accountAddress)) {
        this.merkleRoot = merkle.tree.root;
        this.userAddress = merkleTreeUser.address;
        this.rewardIndex = index;
        this.rewardAmount = Number(merkleTreeUser.amount);
        this.rewardMerkleProof = merkleTreeUser.proof;
      }
    });
    if (this.userAddress) {
      await this.cumulativeClaimed();
    }
  }

  @computed
  get userRewardAmount() {
    // eslint-disable-next-line radix
    return Number(fromWei(parseInt(String(this.rewardAmount)).toString())) - this.claimedRewards;
  }

  @computed
  get userEligibleRewards() {
    // eslint-disable-next-line radix
    return this.userRewardAmount + this.claimedRewards;
  }
}

export default DistributionStore;
