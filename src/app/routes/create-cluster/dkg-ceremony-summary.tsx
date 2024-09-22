import { useState, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Span, Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { FaCircleCheck, FaRegFolderClosed } from "react-icons/fa6";
import { Divider } from "@/components/ui/divider";
import { cn } from "@/lib/utils/tw";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLinks } from "@/hooks/use-links";
import { Link } from "react-router-dom";

export const DKGCeremonySummary: FC = () => {
  const [hasConfirmedRegistration, setHasConfirmedRegistration] =
    useState(false);
  const links = useLinks();
  return (
    <Container
      size="lg"
      variant="vertical"
      className="[&>*]:w-full font-medium py-6"
    >
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
        <Text>
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
        <div className="flex flex-col items-start gap-5 p-3 bg-gray-200 border border-gray-400 rounded-lg">
          <div className="space-y-1">
            <Badge variant="primary" size="sm">
              deposit_data.json
            </Badge>
            <Text variant="body-2-medium">
              This file contains the deposit data needed to activate your
              validator on the Beacon Chain.
            </Text>
          </div>
          <div className="space-y-1">
            <Badge variant="primary" size="sm">
              keyshares.json
            </Badge>
            <Text variant="body-2-medium">
              This file contains the keyshares necessary to register your
              validator on the SSV Network.
            </Text>
          </div>
          <div className="space-y-1">
            <Badge variant="primary" size="sm">
              proofs.json
            </Badge>
            <Text variant="body-2-medium">
              This file contains the signatures indicating that the ceremony was
              conducted by the cluster operators and is{" "}
              <b>crucial for resharing</b>
              your validator with a different set of operators in the future.
              Please ensure to <b>back up</b> this file securely.
            </Text>
          </div>
          <Divider className="w-full" />
          <Text variant="body-2-medium">
            For ceremonies generating more than one validator, you will find
            aggregated versions of all the previously mentioned files within the{" "}
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-200 border border-gray-400 rounded-md">
              <FaRegFolderClosed className="size-3" />
              <Text variant="caption-bold">ceremony-[timestamp]</Text>
            </div>{" "}
            folder.
          </Text>
        </div>
      </Card>
      <Card
        className={cn({
          "border border-primary-500": !hasConfirmedRegistration,
        })}
      >
        <div className="flex justify-between">
          <Text variant="headline4">
            <Span className="text-primary-500">Step 2:</Span> Deposit Validator
          </Text>
          {hasConfirmedRegistration && (
            <Badge variant="success" size="sm">
              Completed <FaCircleCheck />
            </Badge>
          )}
        </div>
        <Text variant="body-2-medium">
          Activate your validator on the Beacon Chain by depositing 32 ETH into
          Ethereum's Deposit Contract.You can deposit your validator using{"  "}
          <Button as="a" href={links.launchpad} target="_blank" variant="link">
            Ethereum's Launch Pad
          </Button>{" "}
          or refer to the{" "}
          <Button
            as="a"
            href="https://docs.ssv.network/validator-user-guides/validator-management/creating-a-new-validator#activate-validator-keys"
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
            <Span className="text-primary-500">Step 2:</Span> Register Validator
          </Text>
        </div>
        <Text>
          Run your validator on the SSV Network by registering and distributing
          its key shares to your cluster operators.
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
    </Container>
  );
};

DKGCeremonySummary.displayName = "DKGCeremonySummary";
