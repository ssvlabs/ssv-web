import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { OSName } from "@/lib/utils/os";
import { generateSSVKeysCMD } from "@/lib/utils/keyshares";
import { useSSVAccount } from "@/hooks/use-ssv-account";
import { useAccount } from "@/hooks/account/use-account";
import type { Operator } from "@/types/api";
import { useCopyToClipboard } from "react-use";
import { LuCheck, LuCopy } from "react-icons/lu";

interface SSVKeysInstructionsProps {
  operators: Operator[];
}

export const SSVKeysInstructions: FC<SSVKeysInstructionsProps> = ({
  operators,
}) => {
  const [copyState, copy] = useCopyToClipboard();

  const ssvAccount = useSSVAccount();
  const account = useAccount();

  if (!ssvAccount || !account)
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );

  const cmd = generateSSVKeysCMD({
    operators,
    nonce: ssvAccount?.data?.nonce ?? 0,
    account: account.address!,
  });

  return (
    <ol className="list-decimal list-inside flex flex-col gap-4 font-medium">
      <Text>Instructions</Text>
      <li>
        Download the <b>{OSName}</b> executable from{" "}
        <Button
          as="a"
          href="https://github.com/ssvlabs/ssv-keys/releases"
          variant="link"
          target="_blank"
        >
          SSV-Keys Github
        </Button>
      </li>
      <li>Launch your terminal</li>
      <li>Navigate to the directory you downloaded the CLI tool</li>
      <li>Run the tool with the following command:</li>
      <div className="flex bg-gray-700 text-gray-50 text-sm p-4 py-2 pr-2 rounded-lg items-center gap-4">
        <Text className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {cmd}
        </Text>
        <Button
          size="sm"
          className="h-8"
          variant={copyState.value ? "success" : "secondary"}
          onClick={() => copy(cmd)}
        >
          <Text>{copyState.value ? "Copied" : "Copy"}</Text>
          {copyState.value ? (
            <LuCheck className="size-3 text-inherit" strokeWidth="3" />
          ) : (
            <LuCopy className="size-3 text-inherit" strokeWidth="2.5" />
          )}
        </Button>
      </div>
      <Tooltip
        content={copyState.value ? undefined : "First, copy the command above"}
      >
        <Button
          as={Link}
          to="../keyshares"
          size="xl"
          className="w-full"
          disabled={!copyState.value}
        >
          Next
        </Button>
      </Tooltip>
    </ol>
  );
};

SSVKeysInstructions.displayName = "SSVKeysInstructions";
