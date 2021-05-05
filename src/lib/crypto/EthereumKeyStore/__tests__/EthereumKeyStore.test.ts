import fs from 'fs';
import path from 'path';
import EthereumKeyStore from '~lib/crypto/EthereumKeyStore';

describe('Check private key decryption', () => {
  it('Should decrypt without error', async () => {
    const keyStoreFilePath = path.join(__dirname, 'test.keystore.json');
    const keyStoreString: string = fs.readFileSync(keyStoreFilePath).toString();
    const keyStoreData = JSON.parse(keyStoreString);
    const keyStore = new EthereumKeyStore(keyStoreData);
    const password = 'testtest';
    const privateKey = await keyStore.getPrivateKey(password);
    console.log('privateKey:', privateKey);
    const probablyCorrect = [
      '63bc15d14d1460491535700fa2b6ac8873e1ede401cfc46e0c5ce77f00633d29',
      '198008dc589f2d6fb2c8258319e1a0d4c64f89442d8735f27a76f1946f632cfa',
    ];
    expect(privateKey).toBeDefined();
    expect(privateKey?.length).toEqual(64);
    // @ts-ignore
    expect(probablyCorrect.indexOf(privateKey)).not.toEqual(-1);
  });
});
