import { rootStore } from '~root/stores';
import UpgradeStore from '~app/common/stores/Upgrade.store';

describe('Check Upgrade Store', () => {
  it('Check cdtBalanceFormatted', () => {
    const upgradeStore: UpgradeStore = rootStore.Upgrade;

    upgradeStore.userCdtBalance = 0.0000000000000001;
    expect(upgradeStore.cdtBalanceFormatted()).toEqual('0.0000000000000001');

    upgradeStore.userCdtBalance = 0.123456;
    expect(upgradeStore.cdtBalanceFormatted()).toEqual('0.1234');

    upgradeStore.userCdtBalance = 123456;
    expect(upgradeStore.cdtBalanceFormatted()).toEqual('123456');

    upgradeStore.userCdtBalance = 123456.654321;
    expect(upgradeStore.cdtBalanceFormatted()).toEqual('123456.6543');

    upgradeStore.userCdtBalance = 0.0;
    expect(upgradeStore.cdtBalanceFormatted()).toEqual('0');
  });
});
