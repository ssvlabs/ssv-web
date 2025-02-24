import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Text, textVariants } from "@/components/ui/text.tsx";

const DescriptionCard = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const truncatedText =
    description.length > 170 && !isExpanded
      ? description.slice(0, 170) + "..."
      : description;

  return (
    <div className="w-full flex flex-row justify-between bg-gray-200 p-2 items-center rounded-[12px]">
      <Text variant="body-3-medium">{truncatedText}</Text>
      {description.length > 170 && (
        <Button
          className={`${textVariants({ variant: "body-3-medium" })} text-primary-500`}
          variant="link"
          onClick={toggleExpand}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
};

export default DescriptionCard;
