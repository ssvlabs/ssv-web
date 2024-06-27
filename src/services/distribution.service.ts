import { IMerkleData } from '~app/model/merkleTree.model';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { getRequest } from '~root/services/httpApi.service';

const fetchMerkleTreeStructure = async (): Promise<IMerkleData | null> => {
  const { api } = getStoredNetwork();
  const merkleTreeUrl = `${api}/incentivization/merkle-tree`;
  try {
    return await getRequest(merkleTreeUrl, true);
  } catch (error) {
    console.log('Failed to check reward eligibility');
    return null;
  }
};

export { fetchMerkleTreeStructure };
