import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import merkleTree from '~app/components/applications/Distribution/assets/merkleTree.json';
import NotificationsStore from '~app/common/stores/applications/Distribution/Notifications.store';

/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */

class DistributionStore extends BaseStore {
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
      const applicationStore: ApplicationStore = this.getStore('Application');
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      applicationStore.setIsLoading(true);
      await contract.methods.claim(
        this.rewardIndex,
        this.userAddress,
        String(this.rewardAmount),
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
    return walletStore.fromWei(String(this.rewardAmount));
  }
}

export default DistributionStore;
