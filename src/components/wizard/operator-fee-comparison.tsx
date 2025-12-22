import { useState, useMemo } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/tw.ts";
import { OperatorAvatar } from "@/components/operator/operator-avatar.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Collapse } from "react-collapse";
import type { Operator } from "@/types/api.ts";
import { getYearlyFee } from "@/lib/utils/operator.ts";
import { formatSSV } from "@/lib/utils/number.ts";

type OperatorFeeComparisonProps = {
  operators: Pick<Operator, "id" | "name" | "logo" | "fee">[];
};

export const OperatorFeeComparison = ({
  operators,
}: OperatorFeeComparisonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate totals from operators
  const totals = useMemo(() => {
    const totalYearlyFeeSSV = operators.reduce(
      (sum, op) => sum + getYearlyFee(BigInt(op.fee)),
      0n,
    );
    const totalSSVFormatted = `${formatSSV(totalYearlyFeeSSV)} SSV`;

    return {
      totalSSVFormatted,
    };
  }, [operators]);

  return (
    <div
      className={cn(
        "bg-primary-50 border border-primary-50 flex flex-col  p-5 rounded-xl w-full transition-all duration-200",
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center justify-between w-full cursor-pointer transition-all duration-200",
          {
            "mb-5": isExpanded,
          },
        )}
      >
        <Text variant="body-1-bold" className="text-gray-800">
          Operators Fee Comparison
        </Text>
        <ChevronDown
          className={cn("size-4 text-gray-800 transition-transform", {
            "transform rotate-180": isExpanded,
          })}
        />
      </button>

      <Collapse isOpened={isExpanded}>
        <div className="grid grid-cols-[1fr_auto_32px_auto] gap-x-0 gap-y-2">
          {/* Header */}
          <div className="text-sm font-semibold text-gray-500">Name</div>
          <div className="text-sm font-semibold text-gray-500 text-right">
            Yearly Fee (SSV)
          </div>
          <div></div>
          <div className="text-sm font-semibold text-gray-500 text-right">
            Yearly Fee (ETH)
          </div>

          {/* Operator Rows */}
          {operators.map((operator) => {
            const yearlyFeeSSV = formatSSV(getYearlyFee(BigInt(operator.fee)));

            return (
              <div key={operator.id} className="contents">
                <div className="flex gap-3 items-center h-10">
                  <OperatorAvatar
                    src={operator.logo}
                    size="sm"
                    variant="square"
                    className="bg-gray-200 rounded"
                  />
                  <div className="flex flex-col">
                    <Text variant="body-2-medium" className="text-gray-800">
                      {operator.name}
                    </Text>
                    <Text variant="caption-medium" className="text-gray-500">
                      ID: {operator.id}
                    </Text>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <Text
                    variant="body-2-medium"
                    className="text-gray-800 text-right font-mono tracking-tight"
                  >
                    {yearlyFeeSSV} SSV
                  </Text>
                  <Text variant="caption-medium" className="text-gray-500">
                    ~$0
                  </Text>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="size-4 text-gray-500" />
                </div>

                <div className="flex flex-col items-end justify-center">
                  <Text
                    variant="body-2-medium"
                    className="text-gray-800 text-right font-mono tracking-tight"
                  >
                    0 ETH
                  </Text>
                  <Text variant="caption-medium" className="text-gray-500">
                    ~$0
                  </Text>
                </div>
              </div>
            );
          })}

          {/* Divider - spans all columns */}
          <div className="col-span-4">
            <Divider className="my-2" />
          </div>

          {/* Total Row - uses same grid template */}
          <div className="flex items-center">
            <Text variant="body-2-medium" className="text-gray-800">
              Total
            </Text>
          </div>
          <div className="flex flex-col items-end">
            <Text
              variant="headline4"
              className="text-gray-800 text-right font-mono tracking-tight"
            >
              {totals.totalSSVFormatted}
            </Text>
            <Text variant="body-3-medium" className="text-gray-500">
              ~$0
            </Text>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="size-4 text-gray-500" />
          </div>
          <div className="flex flex-col items-end">
            <Text
              variant="headline4"
              className="text-gray-800 text-right font-mono tracking-tight"
            >
              0 ETH
            </Text>
            <Text variant="body-3-medium" className="text-gray-500">
              ~$0
            </Text>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
