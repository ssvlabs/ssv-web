import { Contract } from 'ethers';
// import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import { equalsAddresses } from '~lib/utils/strings';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import NotificationsStore from '~app/common/stores/applications/Distribution/Notifications.store';
import { getCurrentNetwork } from '~lib/utils/envHelper';
import { IMerkleData, IMerkleTreeData } from '~app/model/merkleTree.model';


/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */

class DistributionStore extends BaseStore {
  @observable merkleRoot: string = '';
  @observable userAddress: string = '';
  @observable rewardIndex: number = 0;
  @observable rewardAmount: number = 0;
  @observable claimed: boolean = false;
  @observable claimedRewards: number = 0;
  @observable rewardMerkleProof: string[] = [];
  @observable userWithdrawRewards: boolean = false;
  @observable distributionContractInstance: Contract | null = null;


  @action.bound
  async claimRewards() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const contract = this.distributionContract;
      const walletStore: WalletStore = this.getStore('Wallet');
      const applicationStore: ApplicationStore = this.getStore('Application');
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      applicationStore.setIsLoading(true);
      await contract.methods.claim(
        this.userAddress,
        String(this.rewardAmount),
        this.merkleRoot,
        this.rewardMerkleProof,
      ).send({ from: walletStore.accountAddress })
        .on('receipt', async (receipt: any) => {
          console.log(receipt);
          applicationStore.setIsLoading(false);
          applicationStore.showTransactionPendingPopUp(false);
          this.userWithdrawRewards = true;
          this.claimed = true;
          resolve(true);
        })
        .on('transactionHash', (txHash: string) => {
          applicationStore.txHash = txHash;
          applicationStore.showTransactionPendingPopUp(true);
        })
        .on('error', (error: any) => {
          applicationStore.setIsLoading(false);
          notificationsStore.showMessage(error.message, 'error');
          applicationStore.showTransactionPendingPopUp(false);
          resolve(false);
        });
    });
  }

  @action.bound
  async cumulativeClaimed() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const contract = this.distributionContract;
      const walletStore: WalletStore = this.getStore('Wallet');
      const result = await contract.methods.cumulativeClaimed(this.userAddress).call();
      this.claimedRewards = Number(walletStore.fromWei(parseInt(String(result)).toString()));
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
    // @ts-ignore

    const merkle = await this.fetchMerkleTreeStructure();
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

  async fetchMerkleTreeStructure(): Promise<IMerkleData | null>{
    const { api } = getCurrentNetwork();
    const merkleTreeUrl = `${api}/incentivization/merkle-tree`;
    try {
      const response = await fetch(merkleTreeUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: IMerkleData = await response.json();
      return data;
    }
    catch (error) {
      console.log('Failed to check reward eligibility');
      return null;
    }
  }

  /**
   * @url https://docs.metamask.io/guide/registering-your-token.html
   */
  @action.bound
  registerSSVTokenInMetamask() {
    return new Promise((resolve, reject) => {
      return this.getStore('Wallet').web3.currentProvider.send({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: config.CONTRACTS.SSV_TOKEN.ADDRESS,
            symbol: 'SSV',
            decimals: 18,
          },
        },
      }, (error: any, success: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    }).then((success: any) => {
      if (!success) {
        this.getStore('Notifications')
          .showMessage('Can not add SSV to wallet!', 'error');
      }
    }).catch((error: any) => {
      console.error('Can not add SSV token to wallet', error);
      this.getStore('Notifications')
        .showMessage(`Can not add SSV to wallet: ${error.message}`, 'error');
    });
  }

  /**
   * Returns instance of Distribution contract
   */
  @computed
  get distributionContract(): Contract {
    if (!this.distributionContractInstance) {
      const walletStore: WalletStore = this.getStore('Wallet');
      this.distributionContractInstance = new walletStore.web3.eth.Contract(
        config.CONTRACTS.SSV_DISTRIBUTION.ABI,
        config.CONTRACTS.SSV_DISTRIBUTION.ADDRESS,
      );
    }
    return <Contract> this.distributionContractInstance;
  }

  @computed
  get userRewardAmount() {
    const walletStore: WalletStore = this.getStore('Wallet');
    // eslint-disable-next-line radix
    return Number(walletStore.fromWei(parseInt(String(this.rewardAmount)).toString())) - this.claimedRewards;
  }

  @computed
  get userEligibleRewards() {
    // eslint-disable-next-line radix
    return this.userRewardAmount + this.claimedRewards;
  }
}

export default DistributionStore;
