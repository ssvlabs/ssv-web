import { Text } from "@/components/ui/text.tsx";
import { Container } from "@/components/ui/container.tsx";

const MyStrategies = () => {
  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className=" flex items-center gap-2"></div>
      <div className="h-[100px] w-full flex items-center gap-10 rounded-[16px] bg-white p-6"></div>
      <Text variant="body-1-semibold">Assets</Text>
    </Container>
  );
};

export default MyStrategies;
