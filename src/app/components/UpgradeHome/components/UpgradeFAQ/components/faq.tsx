import React from 'react';
import BaseStore from '~app/common/stores/BaseStore';
import UpgradeStore from '~app/common/stores/Upgrade.store';

const upgradeStore: UpgradeStore = BaseStore.getInstance().getStore('Upgrade');

const faq = [
  {
    question: <>What are SSV tokens?</>,
    answer: <>Secret Shared Validator (SSV) is the native token of the SSV network - a network that provides the
      infrastructure for decentralized ETH staking.</>,
  },
  {
    question: <>How long will this upgrade last?</>,
    answer: <>The upgrade process currently has no hard deadline and users will be able to use the upgrade interface as
      many times as they would like.</>,
  },
  {
    question: <>What is the conversion rate?</>,
    answer: <>CDT tokens will be upgraded to SSV tokens based on a predetermined fixed rate of 1 CDT = 0.01 SSV.</>,
  },
  {
    question: <>Can I revert my tokens back to CDT?</>,
    answer: <>No, the SSV upgrade is final and irreversible. Once upgraded you will not be able to retrieve your
      original CDT tokens; after carrying out the transaction the upgrade is final.</>,
  },
  {
    question: <>How are exchanges handling the upgrade?</>,
    answer: (
      <>
        The upgrade interface only helps users upgrade CDT tokens held in self-custody wallets (such as Metamask for
        example).
        <br /><br />
        If you hold CDT in other exchanges (centralized or decentralized) or any other platform where you do not control
        the private keys to the wallet - you won’t be able to upgrade your CDT automatically. Your alternative is
        withdrawing your funds to your personal wallet, and then upgrading your CDT manually through the dedicated
        interface.
        <br /><br />
        Please note: do not transfer the new SSV tokens to a centralized exchange unless the exchange is already
        providing support for the new SSV token.
      </>
    ),
  },
  {
    question: <>How do I see my new SSV tokens on my Metamask extension?</>,
    answer: (
      <ul>
        <li>On Metamask, click the button &apos;Add Token&apos; then go to the tab &apos;Custom Token&apos;</li>
        <li>
          Under &apos;Token Contract Address&apos;, paste the new SSV contract address:
          <br />
          <div style={{ whiteSpace: 'nowrap', maxWidth: '100%' }}>{upgradeStore.getContractAddress('ssv')}</div>
        </li>
        <li>Add the new SSV token</li>
      </ul>
    ),
  },
  {
    question: <>What wallets are supported by the swap interface?</>,
    answer: <>At the moment the interface supports: <br />MetaMask, Ledger via MetaMask and Trezor via MetaMask.</>,
  },
  {
    question: <>Is the upgrade contract audited?</>,
    answer: (
      <>
        Yes, the upgrade contract was audited by CoinFabrik <br />
        <a
          href="https://blog.coinfabrik.com/blox-staking-audit-vesting-and-dex-contracts/"
          target="_blank"
        >
          https://blog.coinfabrik.com/blox-staking-audit-vesting-and-dex-contracts/
        </a>
      </>
    ),
  },
];

export default faq;
