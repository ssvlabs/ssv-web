export interface IOperator {
  id: number;
  fee?: string;
  name: string;
  logo?: string;
  type?: string;
  address: string;
  score?: number;
  public_key: string;
  selected?: boolean;
  dappNode?: boolean;
  ownerAddress: string;
  dkg_address?: string;
  mev_relays?: string;
  autoSelected?: boolean
  validators_count: number;
  address_whitelist: string
  verified_operator?: boolean;
  balance: number;
}
