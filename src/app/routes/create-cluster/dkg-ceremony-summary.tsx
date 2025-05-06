import { useState, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Span, Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { FaCircleCheck, FaRegFolderClosed } from "react-icons/fa6";
import { cn } from "@/lib/utils/tw";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLinks } from "@/hooks/use-links";
import { Link } from "react-router-dom";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import CeremonySummary from "@/app/routes/create-cluster/ceremony-summary.tsx";

export const DKGCeremonySummary: FC = () => {
  const [hasConfirmedRegistration, setHasConfirmedRegistration] =
    useState(false);
  const links = useLinks();
  return (
    <Container size="lg" variant="vertical" className="font-medium py-6">
      <NavigateBackBtn by="path" to="../offline" className="w-min" />
      <div className="flex flex-col gap-6 items-start [&>*]:w-full">
        <Card>
          <Text variant="headline3">DKG Ceremony Summary</Text>
        </Card>
        <Card>
          <div className="flex justify-between">
            <Text variant="headline4">
              <Span className="text-primary-500">Step 1:</Span> Validator Key
              Generation
            </Text>
            <Badge variant="success" size="sm">
              Completed <FaCircleCheck />
            </Badge>
          </div>
          <Text variant="body-2-medium">
            Following the successful completion of the ceremony, several files
            have been generated and placed in the{" "}
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-200 border border-gray-400 rounded-md">
              <FaRegFolderClosed className="size-3" />
              <Text variant="caption-bold">
                ceremony-[timestamp]/[owner-nonce]-[validator-pubkey]
              </Text>
            </div>{" "}
            folder under the directory the command was initiated:
          </Text>
          <CeremonySummary />
        </Card>
        <Card
          className={cn({
            "border border-primary-500": !hasConfirmedRegistration,
          })}
        >
          <div className="flex justify-between">
            <Text variant="headline4">
              <Span className="text-primary-500">Step 2:</Span> Deposit
              Validator
            </Text>
            {hasConfirmedRegistration && (
              <Badge variant="success" size="sm">
                Completed <FaCircleCheck />
              </Badge>
            )}
          </div>
          <Text variant="body-2-medium">
            Activate your validator on the Beacon Chain by depositing 32 ETH
            into Ethereum's Deposit Contract.You can deposit your validator
            using{"  "}
            <Button
              as="a"
              href={links.launchpad}
              target="_blank"
              variant="link"
            >
              Ethereum's Launch Pad
            </Button>{" "}
            or refer to the{" "}
            <Button
              as="a"
              href="https://docs.ssv.network/stakers/validator-management/creating-a-new-validator/#activate-validator-keys"
              target="_blank"
              variant="link"
            >
              validator activation guide
            </Button>{" "}
            for assistance.
          </Text>
          <Button
            disabled={hasConfirmedRegistration}
            onClick={() => setHasConfirmedRegistration(true)}
            size="xl"
          >
            {hasConfirmedRegistration && <Check className="size-5" />}
            My validator has been activated
          </Button>
        </Card>
        <Card
          className={cn({
            "border border-primary-500": hasConfirmedRegistration,
          })}
        >
          <div className="flex justify-between">
            <Text variant="headline4">
              <Span className="text-primary-500">Step 3:</Span> Register
              Validator
            </Text>
          </div>
          <Text variant="body-2-medium">
            Run your validator on the SSV Network by registering and
            distributing its key shares to your cluster operators.
          </Text>
          <Button
            as={Link}
            to="../keyshares"
            disabled={!hasConfirmedRegistration}
            size="xl"
          >
            Register Validator
          </Button>
        </Card>
      </div>
    </Container>
  );
};

DKGCeremonySummary.displayName = "DKGCeremonySummary";
