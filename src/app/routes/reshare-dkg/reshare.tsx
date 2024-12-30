import ReshareDkg from "@/app/routes/reshare-dkg/reshare-dkg.tsx";
import { UnhealthyOperatorsList } from "@/components/offline-generation/unhealthy-operators-list.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { useOperatorsDKGHealth } from "@/hooks/operator/use-operator-dkg-health.ts";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text.tsx";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import { SsvLoader } from "@/components/ui/ssv-loader.tsx";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tw.ts";
import { isContractWallet } from "@/hooks/account/use-account.ts";

const Reshare = () => {
  const context = useBulkActionContext();
  const operators = context.dkgReshareState.newOperators.length
    ? context.dkgReshareState.newOperators
    : context.dkgReshareState.operators;
  const health = useOperatorsDKGHealth(operators);
  const reshareAccepted = isContractWallet()
    ? health.data?.every(
        ({ isHealthy, isEthClientConnected, isOutdated, isMismatchId }) =>
          isHealthy && isEthClientConnected && !isOutdated && !isMismatchId,
      )
    : health.data?.every(
        ({ isHealthy, isMismatchId, isOutdated }) =>
          isHealthy && !isMismatchId && !isOutdated,
      );

  if (health.isLoading) {
    return (
      <motion.div
        className={cn(
          "fixed flex-col gap-1 bg-gray-50 inset-0 flex h-screen items-center justify-center",
        )}
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SsvLoader className={"size-[160px]"} />
      </motion.div>
    );
  }

  return reshareAccepted ? (
    <ReshareDkg />
  ) : (
    <Container size="lg" variant="vertical" className="py-6">
      <NavigateBackBtn by="path" to="../select-operators" />
      <Card className="w-full">
        <Text variant="headline4">
          Pick the cluster of network operators to run your validator
        </Text>
        <UnhealthyOperatorsList
          isReshareMultiSigFlow={isContractWallet()}
          operators={operators ?? []}
          health={health.data ?? []}
        />

        <Button
          as={Link}
          to="../select-operators?has_dkg_address=true"
          size="xl"
          className="w-full"
        >
          Change Operators
        </Button>
      </Card>
    </Container>
  );
};

export default Reshare;
