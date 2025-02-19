import { Text } from "@/components/ui/text.tsx";

const AssetsModal = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div
      style={{ backgroundColor: "rgba(11, 42, 60, 0.16)" }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <div className="w-[648px] relative rounded-lg shadow-lg bg-background p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-row justify-between items-center">
              <Text className="font-bold text-xl">
                Validator Balance Delegation
              </Text>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                &#10005;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsModal;
