import { Badge } from "@/components/ui/badge.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { FaRegFolderClosed } from "react-icons/fa6";
import { useState } from "react";

const CeremonySummary = ({
  isDkgReshareFlow = false,
}: {
  isDkgReshareFlow?: boolean;
}) => {
  const [isShowAll, setIsShowAll] = useState(false);
  const setShowAllHandler = () => setIsShowAll(!isShowAll);
  return (
    <div className="flex flex-col items-start gap-5 px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg">
      {isDkgReshareFlow && (
        <div className="flex flex-row justify-between items-center w-full">
          <Text className="text-[16px] font-bold">Generated Files Summary</Text>
          <Text
            onClick={setShowAllHandler}
            className="text-sm text-primary-500 cursor-pointer"
          >
            Show more
          </Text>
        </div>
      )}
      {(!isDkgReshareFlow || isShowAll) && (
        <div className="flex flex-col gap-4">
          {isDkgReshareFlow && (
            <Text variant="body-2-medium">
              Following the successful completion of the ceremony, several files
              have been generated and placed in{" "}
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-200 border border-gray-400 rounded-md">
                <FaRegFolderClosed className="size-3" />
                <Text className="text-sm">
                  ceremony-[timestamp]/[owner-nonce]-[validator-pubkey]
                </Text>
              </div>{" "}
              the folder under the directory the command was initiated:
            </Text>
          )}
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
      )}
    </div>
  );
};

export default CeremonySummary;
