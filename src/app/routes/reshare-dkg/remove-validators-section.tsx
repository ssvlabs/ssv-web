import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Text } from "@/components/ui/text.tsx";
import { CompletedBadge } from "@/components/ui/completed-badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FaExternalLinkAlt } from "react-icons/fa";
import type { Proof } from "@/hooks/use-validate-proofs.ts";

const RemoveValidatorsSection = ({
  isEnabled,
  isCompletedStep,
  nextStep,
  clusterHash,
  validators,
  activateStep,
}: {
  isEnabled: boolean;
  isCompletedStep: boolean;
  clusterHash: string;
  validators: { publicKey: string; proofs: Proof[] }[];
  nextStep: () => void;
  activateStep: () => void;
}) => {
  return (
    <Card
      onClick={activateStep}
      className={`border ${isEnabled ? "border-primary-500" : ""} w-full`}
    >
      <CardHeader
        title={
          <div className="flex">
            <div className="flex w-full">
              <div className="flex w-full">
                <Text className="text-primary-500">Step 3:</Text>&nbsp;
                <Text>Remove Validator</Text>
              </div>
              {isCompletedStep && <CompletedBadge />}
            </div>
          </div>
        }
        description={
          <div className="flex flex-col gap-6">
            <Text>
              To assign your validator to a new cluster, you must first remove
              it from its existing cluster.
            </Text>
            <Text>
              Please note that this action only applies to their removal from
              our network and does not exit your validator from the Beacon
              Chain.
            </Text>
          </div>
        }
      />
      {isEnabled && (
        <div className="flex flex-col gap-4">
          <a
            href={`${window.location.origin}/clusters/${clusterHash}/remove/${validators
              .map(({ publicKey }) => publicKey.slice(2, 22))
              .join(",")}`}
            className={"w-full"}
            target="_blank"
          >
            <Button size="xl" className={"w-full"} variant={"secondary"}>
              Remove Selected Validators <FaExternalLinkAlt />
            </Button>
          </a>
          <Button size="xl" onClick={nextStep}>
            My Validator Has Been Removed
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RemoveValidatorsSection;
