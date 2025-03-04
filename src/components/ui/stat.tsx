import type { ComponentPropsWithRef, FC, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { isNumber, isString } from "lodash-es";
import { FaInfoCircle } from "react-icons/fa";

import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/tw";

export type StatProps = {
  title: string;
  content: ReactNode;
  tooltip?: ReactNode;
  subContent?: ReactNode;
};

type StatFC = FC<
  Omit<ComponentPropsWithRef<"div">, keyof StatProps> & StatProps
>;

export const Stat: StatFC = ({
  className,
  title,
  tooltip,
  content,
  subContent,
  ...props
}) => {
  const ContentComponent = isString(content) || isNumber(content) ? Text : Slot;
  const SubContentComponent =
    isString(subContent) || isNumber(subContent) ? Text : Slot;
  return (
    <div className={cn(className, "gap-2")} {...props}>
      <div>
        <Tooltip content={tooltip}>
          <div className="flex items-center gap-1">
            <Text variant="caption-medium" className="text-gray-500">
              {title}
            </Text>
            {tooltip && <FaInfoCircle className="size-3 text-gray-500" />}
          </div>
        </Tooltip>
        <ContentComponent className="text-xl font-bold">
          {content}
        </ContentComponent>
      </div>
      {subContent && (
        <SubContentComponent variant="caption-medium" className="text-gray-500">
          {subContent}
        </SubContentComponent>
      )}
    </div>
  );
};

Stat.displayName = "Stat";
