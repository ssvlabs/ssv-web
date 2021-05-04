import { scrypt } from 'scrypt-js';
import Wallet from 'ethereumjs-wallet';

/**
 * Decrypt private key from key store data
 * Supports key store versions: v1, v3, v4
 *
 * Example of usage (Node env):
 *
 *  const keyStoreFilePath = path.join(process.cwd(), 'validator_keys', 'keystore-m_12381_3600_0_0_0-1620054853.json');
 *  const keyStoreString: string = fs.readFileSync(keyStoreFilePath).toString();
 *  const keyStoreData = JSON.parse(keyStoreString);
 *  const keyStore = new EthereumKeyStore(keyStoreData);
 *  const password = 'testtest';
 *  console.log('Private Key:', await keyStore.getPrivateKey(password));
 */
class EthereumKeyStore {
  private readonly keyStoreData: any;

  /**
   * Receive key store data from string or parsed JSON
   * @param keyStoreData
   */
  constructor(keyStoreData: string | any) {
    if (!keyStoreData) {
      throw new Error('Key store data should be JSON or string');
    }
    if (typeof keyStoreData !== 'string') {
      this.keyStoreData = keyStoreData;
    } else {
      this.keyStoreData = JSON.parse(String(keyStoreData));
    }
  }

  /**
   * Decrypt private key using user password
   * @param password
   */
  async getPrivateKey(password: string = '') {
    let wallet;
    switch (this.keyStoreData.version) {
      case 1:
        wallet = await Wallet.fromV1(this.keyStoreData, password);
        return wallet.getPrivateKey().toString('hex');
      case 3:
        wallet = await Wallet.fromV3(this.keyStoreData, password, true);
        return wallet.getPrivateKey().toString('hex');
      case 4:
        return this.fromV4(password);
    }
  }

  /**
   * Decrypt private key from keystore version 4
   * @param password
   * @private
   */
  private async fromV4(password: string): Promise<string> {
    const params = this.keyStoreData.crypto.kdf.params;
    const result = await scrypt(
      Buffer.from(password),
      Buffer.from(params.salt, 'hex'),
      params.n,
      params.r,
      params.p,
      params.dklen,
    );
    return EthereumKeyStore.toHexString(result);
  }

  /**
   * Convert byte array to string
   * @param byteArray
   */
  static toHexString(byteArray: Uint8Array) {
    return Array.from(byteArray, (byte: number) => {
      // eslint-disable-next-line no-bitwise
      return (`0${(byte & 0xFF).toString(16)}`).slice(-2);
    }).join('');
  }
}

export default EthereumKeyStore;
