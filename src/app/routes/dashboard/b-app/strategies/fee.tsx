import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import Slider from "@/components/ui/slider.tsx";

const Fee = () => {
  return (
    <Container
      variant="vertical"
      size="xl"
      className="w-[648px] h-[308px] rounded-[16px] bg-white flex-col gap-8 p-6 mt-6"
    >
      <div className="flex flex-col gap-3">
        <Text variant="body-1-bold">Set Strategy Fee</Text>
        <Text>
          Strategies can set their fee rate on Service rewards. There is no
          default fee, a Strategy can set this to any amount from 0% to 100% of
          Service rewards.
        </Text>
        <Text>
          Please note that you could always change this fee (according to
          limitations) to align with market dynamics.
        </Text>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="w-[140px] h-[80px] flex items-center justify-center bg-gray-100 border border-primary-500 rounded-[12px]">
          0%
        </div>
        <Slider maxValue={100} setValue={() => null} value={0} />
        <div className="w-[140px] h-[80px] flex items-center justify-center bg-gray-100 border rounded-[12px]">
          100%
        </div>
      </div>
    </Container>
  );
};

export default Fee;
