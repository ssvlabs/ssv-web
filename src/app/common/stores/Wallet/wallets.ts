// import config from '~app/common/config';

export const wallets: any = [
    { walletName: 'metamask' },
    { walletName: 'metamask', label: 'Ledger', iconSrc: '/images/ledger.svg' },
    { walletName: 'metamask', label: 'Trezor', iconSrc: '/images/trezor.svg' },
];
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    wallets.push({ walletName: 'walletConnect', infuraKey: '68cc79febad74019825762c8384ddbeb' });
}