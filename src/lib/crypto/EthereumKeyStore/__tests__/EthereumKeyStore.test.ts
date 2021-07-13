import fs from 'fs';
import path from 'path';
import EthereumKeyStore from 'eth2-keystore-js';

describe('Check private key decryption', () => {
  it('Should decrypt without error', async () => {
    const keyStoreFilePath = path.join(__dirname, 'test.keystore.json');
    const keyStoreString: string = fs.readFileSync(keyStoreFilePath).toString();
    const keyStoreData = JSON.parse(keyStoreString);
    const keyStore = new EthereumKeyStore(keyStoreData);
    const password = 'testtest';
    const privateKey = await keyStore.getPrivateKey(password);
    const correctPrivateKey = '63bc15d14d1460491535700fa2b6ac8873e1ede401cfc46e0c5ce77f00633d29';
    expect(privateKey).toBeDefined();
    expect(privateKey?.length).toEqual(64);
    expect(correctPrivateKey).toEqual(privateKey);
  });
});
