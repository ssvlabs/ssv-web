import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input.tsx";
import { FaAngleDown, FaRegTrashCan } from "react-icons/fa6";
import { useAddAsset } from "@/hooks/b-app/use-add-asset.ts";
import { Form } from "@/components/ui/form.tsx";
import { useRef, useState } from "react";
import AssetsModal from "@/app/routes/dashboard/b-app/b-apps/assets-modal.tsx";
import { useBAppsAssets } from "@/hooks/b-app/use-assets.ts";
import { useCreateBAppContext } from "@/guard/create-b-app-context.ts";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import AssetName from "@/components/ui/asset-name.tsx";

const CreateBApp = () => {
  const navigate = useNavigate();
  const addManager = useAddAsset();
  const formRef = useRef<HTMLDivElement>(null);
  const [openAssetsModal, setOpenAssetsModal] = useState(false);
  const [openedRowIndex, setOpenedRowIndex] = useState(0);
  const { assets } = useBAppsAssets();
  const addNewAddressField = () => {
    addManager.fieldArray.append({ value: "" });
    setTimeout(() => {
      formRef.current?.scrollTo({
        top: formRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 10);
  };
  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-20 bg-gray-50 flex items-center justify-center">
        <div className="w-[1320px] flex items-center justify-between">
          <Text variant="body-1-bold">Create bApp</Text>
          <Button onClick={() => navigate(-1)} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
      <Container variant="vertical" size="xl" className="py-6">
        <Form {...addManager.form}>
          <div className="flex flex-col p-6 bg-white gap-6 w-full rounded-[16px]">
            <div className="flex flex-col gap-3">
              <Text variant={"body-1-bold"}>bApp Address</Text>
              <Text variant={"body-3-medium"}>Address</Text>
            </div>
            <Input placeholder="0x..." />
          </div>
          <div className="flex flex-col p-6 bg-white gap-6 w-full rounded-[16px]">
            <div className="flex flex-col gap-3">
              <Text variant={"body-1-bold"}>Supported Asset</Text>
              <Text variant={"body-3-medium"}>
                Esbaratione for Select Asset
              </Text>
            </div>
            <div className="flex flex-col gap-3">
              {addManager.fieldArray.fields.map((_, index) => (
                <div className="flex items-center gap-2">
                  <div className="w-[996px] h-[48px] border border-gray-300 px-6 py-3 flex items-center justify-between rounded-[12px]">
                    {useCreateBAppContext.state.getAsset(index) ? (
                      <div className="flex items-center gap-2">
                        <AssetLogo
                          address={
                            useCreateBAppContext.state.getAsset(index)?.token ||
                            "0x"
                          }
                        />
                        <AssetName
                          address={
                            useCreateBAppContext.state.getAsset(index)?.token ||
                            "0x"
                          }
                        />
                      </div>
                    ) : (
                      <Text className="text-gray-500" variant="body-3-medium">
                        Select Asset...
                      </Text>
                    )}
                    <Text
                      className="text-gray-500 cursor-pointer"
                      variant="body-3-medium"
                    >
                      <FaAngleDown
                        onClick={() => {
                          setOpenedRowIndex(index);
                          setOpenAssetsModal(true);
                        }}
                      />
                    </Text>
                  </div>
                  <div className="w-[200px]">
                    <Input
                      value={useCreateBAppContext.state.getAsset(index)?.beta}
                      onChange={(e) => {
                        useCreateBAppContext.state.setAsset(index, {
                          ...(useCreateBAppContext.state.getAsset(index) || {
                            token: "0x",
                          }),
                          beta: e.target.value,
                        });
                      }}
                      placeholder="0"
                      rightSlot={
                        <Text className="text-gray-500" variant="body-3-medium">
                          β
                        </Text>
                      }
                    />
                  </div>
                  <div className="w-[60px]">
                    <Button
                      disabled={addManager.assets.length === 1}
                      onClick={() => {
                        useCreateBAppContext.state.deleteSelectedAsset(index);
                        addManager.fieldArray.remove(index);
                      }}
                      className="h-[48px] bg-gray-300"
                      variant={"ghost"}
                    >
                      <FaRegTrashCan />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={addNewAddressField}
              className="bg-gray-100 text-primary-500 text-[14px] border border-gray-300"
              variant="ghost"
            >
              <Text className="text-primary-500" variant={"body-3-medium"}>
                Add Asset
              </Text>
            </Button>
            {/*<div></div>*/}
          </div>
          <div className="flex flex-col p-6 bg-white gap-6 w-full rounded-[16px]">
            <div className="flex flex-col gap-3">
              <Text variant={"body-1-bold"}>Metadata</Text>
            </div>
            <Input placeholder="0x..." />
            {/*<div></div>*/}
          </div>
        </Form>
      </Container>
      {openAssetsModal && (
        <AssetsModal
          rowIndex={openedRowIndex}
          assets={assets}
          closeModal={() => setOpenAssetsModal(false)}
        />
      )}
    </div>
  );
};

export default CreateBApp;
