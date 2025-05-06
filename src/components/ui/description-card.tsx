import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Text, textVariants } from "@/components/ui/text.tsx";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/tw.ts";

const DescriptionCard = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const truncatedText =
    description.length > 170 && !isExpanded
      ? `${description.slice(0, 170)}...`
      : description;

  return (
    <div className="w-full flex flex-row justify-between bg-gray-200 px-3 py-2 gap-8 rounded-[12px] overflow-hidden">
      <div>
        <Text variant="body-3-medium">{truncatedText}</Text>
      </div>
      {description.length > 170 && (
        <div className="flex items-start">
          <Button
            className={`${textVariants({ variant: "body-3-medium" })} text-primary-500 flex items-center`}
            variant="link"
            onClick={toggleExpand}
          >
            {isExpanded ? "Show Less" : "Show More"}{" "}
            <ChevronDown
              className={cn("size-4", {
                "transform rotate-180": isExpanded,
              })}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DescriptionCard;
