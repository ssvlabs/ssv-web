import { useState } from "react";

export const useDeleteAuthorizedAddresses = () => {
  const [addresses, setAddresses] = useState<string[]>([]);

  const add = (address: string) => {
    setAddresses([...addresses, address]);
  };

  const remove = (address: string) => {
    setAddresses(addresses.filter((a) => a !== address));
  };

  const reset = () => {
    setAddresses([]);
  };

  const isMarked = (address: string) => addresses.includes(address);

  return {
    addresses,
    add,
    remove,
    reset,
    isMarked,
    hasAddresses: addresses.length > 0,
  };
};
