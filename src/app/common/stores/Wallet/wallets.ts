import { getImage } from '~lib/utils/filePath';

export const wallets: any = [
    { walletName: 'metamask' },
    { walletName: 'metamask', label: 'Ledger', iconSrc: getImage('wallets/ledger.svg') },
    { walletName: 'metamask', label: 'Trezor', iconSrc: getImage('wallets/trezor.svg') },
];
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    wallets.push({ walletName: 'walletConnect', infuraKey: '68cc79febad74019825762c8384ddbeb' });
}
