import type { ReactNode } from "react";
import { createContext, useState, useContext } from "react";

interface DelegateContextProps {
  name?: string;
  logo?: string;
  delegateAddress?: string;
  percentage?: string;
  delegatedValue?: string;
  setDelegationData?: ({
    name,
    logo,
    percentage,
    delegateAddress,
    delegatedValue,
  }: {
    name?: string;
    logo?: string;
    percentage?: string;
    delegateAddress?: string;
    delegatedValue?: string;
  }) => void;
  reset: () => void;
}

const DelegateContext = createContext<DelegateContextProps | null>(null);

export const useDelegateContext = () => {
  const context = useContext(DelegateContext);
  if (!context) throw new Error("useDelegateContext");
  return context;
};

export const DelegateProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [percentage, setPercentage] = useState("");
  const [delegateAddress, setDelegateAddress] = useState("");
  const [delegatedValue, setDelegatedValue] = useState("");

  const setDelegationData = ({
    name,
    logo,
    percentage,
    delegateAddress,
    delegatedValue,
  }: {
    name?: string;
    logo?: string;
    percentage?: string;
    delegateAddress?: string;
    delegatedValue?: string;
  }) => {
    setPercentage(percentage || "");
    setDelegateAddress(delegateAddress || "");
    setDelegatedValue(delegatedValue || "");
    setName(name || "");
    setLogo(logo || "");
  };

  const reset = () => {
    setPercentage("");
    setDelegateAddress("");
    setDelegatedValue("");
    setName("");
    setLogo("");
  };

  return (
    <DelegateContext.Provider
      value={{
        name,
        logo,
        percentage,
        delegateAddress,
        delegatedValue,
        setDelegationData,
        reset,
      }}
    >
      {children}
    </DelegateContext.Provider>
  );
};
