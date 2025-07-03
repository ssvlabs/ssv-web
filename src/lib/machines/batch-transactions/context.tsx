import { useMachine } from "@xstate/react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { machine } from "./machine";

type BatchTransactionMachineActor = ReturnType<
  typeof useMachine<typeof machine>
>;

const BatchTransactionContext = createContext<
  BatchTransactionMachineActor | undefined
>(undefined);

export function BatchTransactionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <BatchTransactionContext.Provider value={useMachine(machine)}>
      {children}
    </BatchTransactionContext.Provider>
  );
}

// Custom hook to use the context
export function useBatchTransactionMachine() {
  const context = useContext(BatchTransactionContext);

  if (context === undefined) {
    throw new Error(
      "useBatchTransaction must be used within a BatchTransactionProvider",
    );
  }

  return context;
}
