/* eslint-disable no-async-promise-executor */
import { action, computed, observable } from 'mobx';
import { translations } from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { IMerkleTreeData } from '~app/model/merkleTree.model';
import { setIsLoading, setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { store } from '~app/store';
import { isEqualsAddresses } from '~lib/utils/strings';
import { getContractByName } from '~root/wagmi/utils';
import { fromWei } from '~root/services/conversions.service';
import { fetchMerkleTreeStructure } from '~root/services/distribution.service';

class DistributionStore {
  @observable merkleRoot = '';
  @observable userAddress = '';
  @observable rewardIndex = 0;
  @observable rewardAmount = 0;
  @observable claimed = false;
  @observable claimedRewards = 0;
  @observable rewardMerkleProof: string[] = [];
  @observable userWithdrawRewards = false;

  @action.bound
  async claimRewards() {
    return new Promise(async (resolve) => {
      const contract = getContractByName(EContractName.DISTRIBUTION);
      store.dispatch(setIsLoading(true));
      try {
        const tx = await contract.claim(this.userAddress, String(this.rewardAmount), this.merkleRoot, this.rewardMerkleProof);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        await tx.wait();
        this.userWithdrawRewards = true;
        this.claimed = true;
        resolve(true);
      } catch (error: any) {
        store.dispatch(
          setMessageAndSeverity({
            message: error.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE,
            severity: 'error'
          })
        );
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
    const accountAddress = store.getState().walletState.accountAddress;
    merkle?.tree.data.forEach((merkleTreeUser: IMerkleTreeData, index: number) => {
      if (isEqualsAddresses(merkleTreeUser.address, accountAddress)) {
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

export const distributionStore = new DistributionStore();
export default DistributionStore;
