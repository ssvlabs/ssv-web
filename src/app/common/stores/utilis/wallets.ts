export const wallets: any = [
    { walletName: 'metamask' },
];
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    wallets.push({ walletName: 'walletConnect', infuraKey: '68cc79febad74019825762c8384ddbeb' });
}
