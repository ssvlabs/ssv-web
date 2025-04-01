import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import Slider from "@/components/ui/slider.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { useNavigate } from "react-router-dom";
import { Wizard } from "@/components/ui/wizard.tsx";
import { CreateSteps, STEPS_LABELS } from "@/types/b-app.ts";

const Fee = () => {
  const selectedValue = useCreateStrategyContext().selectedFee;
  const navigate = useNavigate();
  return (
    <Wizard
      onNext={() => navigate("../metadata")}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      children={
        <Container
          variant="vertical"
          size="xl"
          className="w-[648px] h-[308px] rounded-[16px] bg-white flex-col gap-8 p-6 mt-6"
        >
          <div className="flex flex-col gap-3">
            <Text variant="body-1-bold">Set Strategy Fee</Text>
            <Text>
              Strategies can set their fee rate on Service rewards. There is no
              default fee, a Strategy can set this to any amount from 0% to 100%
              of Service rewards.
            </Text>
            <Text>
              Please note that you could always change this fee (according to
              limitations) to align with market dynamics.
            </Text>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="w-[140px] h-[80px] text-[28px] flex items-center justify-center bg-gray-100 border border-primary-500 rounded-[12px] ">
              <div
                className={`flex justify-center items-center m-0 px-${selectedValue.toString().length === 1 ? 10 : selectedValue.toString().length > 3 ? 4 : 8} py-4 relative`}
              >
                <input
                  className={`
                      bg-transparent  focus:outline-none border-none text-right w-full
                    `}
                  type="number"
                  value={useCreateStrategyContext().selectedFee}
                  onChange={(e) => {
                    if (e.target.value.length <= 5) {
                      useCreateStrategyContext.state.selectedFee = Number(
                        e.target.value,
                      );
                    }
                  }}
                />
                %{/*{useCreateStrategyContext().selectedFee}*/}
              </div>
            </div>
            <Slider
              maxValue={100}
              setValue={(value) =>
                (useCreateStrategyContext.state.selectedFee = value)
              }
              value={useCreateStrategyContext().selectedFee}
            />
            <div className="w-[140px] h-[80px] text-[28px] text-gray-5004 flex items-center justify-center bg-gray-100 rounded-[12px] text-gray-500">
              100%
            </div>
          </div>
        </Container>
      }
      currentStepNumber={CreateSteps.SetFee}
      onClose={() => {
        navigate(-1);
      }}
    />
  );
};

export default Fee;
