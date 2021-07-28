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
    question: <>Why should I upgrade my tokens?</>,
    answer: <>SSV&apos;s main use cases are payments and governance. The former will serve as a way for stakers to
      compensate operators for managing their validators; the latter, a way to participate in SSV.network related
      decision-making and treasury allocations. SSV is playing a pivotal role in the network&apos;s ability to harness a
      community and motivate the right stakeholders to meaningfully contribute to the network.</>,
  },
  {
    question: <>For how long will this upgrade last?</>,
    answer: <>The upgrade process has no hard deadline, meaning token upgrades will be supported until all CDT tokens
      have been upgraded to SSV tokens. Users will be able to use the upgrade interface as many times as they would
      like.</>,
  },
  {
    question: <>What is the conversion rate?</>,
    answer: <>CDT tokens will be upgraded to SSV tokens based on a predetermined fixed rate of 1 CDT = 0.01 SSV.</>,
  },
  {
    question: <>Can I revert my tokens back to CDT?</>,
    answer: <>No, the SSV upgrade is final and irreversible, and you will not be able to retrieve your CDTs after
      carrying out the transaction to upgrade.</>,
  },
  {
    question: <>How are exchanges handling the upgrade?</>,
    answer: (
      <>
        The upgrade interface helps users upgrade CDT tokens held in self-custodial wallets (such as Metamask for
        example).
        <br /><br />
        If you hold CDT in other exchanges (centralized or decentralized) or any other platform where you do not control
        the private keys to the wallet - your tokens will not be upgraded automatically and you would first have to
        withdraw your funds to your own wallet, and then upgrade them manually through this interface.
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
    answer: <>At the moment the interface supports: <br />MetaMask, Ledger via MetaMask and Trezr via MetaMask.</>,
  },
  {
    question: <>Why is CDT swapped with SSV?</>,
    answer: (
      <>
        There are a few reasons for the SWAP taking place:
        <ul>
          <li>
            CDT&apos;s original smart contract was created in 2017 and requires an update to be compatible with certain
            Defi platforms.
          </li>
          <li>
            SSV.network requires its own native tokens to incentivize stakeholders in the network. The easiest, fastest
            way to bootstrap a community is to use an existing token with widespread holders and existing community
            behind it.
          </li>
          <li>
            SSV will allow the DAO to mint additional tokens in order to attract funding and operators to the network.
          </li>
          <li>
            CDT is Blox&apos;s native token, SSV belongs to the network and not to a specific entity, there should be a
            clear line in the sand.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: <>What will be the total token supply?</>,
    answer: <>Total token supply will be fixed in later stages. Current plan is to eliminate the token minting option in
      the smart contract closer to product launch. Ultimate decision will be made by the DAO.</>,
  },
  {
    question: <>Is the swap contract audited?</>,
    answer: (
      <>
        Yes, the swap contract was audited by CoinFabrik <br />
        <a
          href="https://blog.coinfabrik.com/blox-staking-audit-vesting-and-dex-contracts/"
          target="_blank"
        >
          https://blog.coinfabrik.com/blox-staking-audit-vesting-and-dex-contracts/
        </a>
      </>
    ),
  },
  {
    question: <>Is there a way for me to earn SSV?</>,
    answer: <>You can earn SSV by becoming an operator in the network. Another option is to stake SSV to ensure stakers
      in the network (will be introduced in later stages).</>,
  },
];

export default faq;
