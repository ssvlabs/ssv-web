import { Text } from "@/components/ui/text.tsx";

export const CompletedBadge = () => (
  <div className="flex gap-2 items-center justify-center bg-success-100 text-sm font-medium text-success-700 py-1 px-2 rounded ">
    <Text className="ml-2">Completed</Text>
    <img className={"size-4 mr-2"} src={`/images/step-done.svg`} />
  </div>
);
