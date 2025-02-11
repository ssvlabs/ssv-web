import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import ImgCropUpload from "@/components/ui/ImgCropUpload.tsx";

const Metadata = () => {
  return (
    <Container variant="horizontal" size="xl" className="py-6">
      <div className="w-[648px] bg-white flex flex-col p-6 rounded-[16px] gap-6">
        <div className="flex flex-col gap-3">
          <Text variant="body-1-bold">Strategy</Text>
          <Text variant="body-2-medium">
            Provide a name and include a short description for your strategy.
          </Text>
        </div>
        <Text variant="body-3-semibold">Strategy Name</Text>
        <Input />
        <Text variant="body-3-semibold">Description</Text>
        <Textarea className="h-[169px] resize-none" />
      </div>
      <div className="w-[648px] bg-white flex flex-col p-6 rounded-[16px] gap-6">
        <div className="flex flex-col gap-3">
          <Text variant="body-1-bold">Account</Text>
          <Text variant="body-2-medium">
            Provide an account name and a profile picture.
          </Text>
          <Text variant="body-2-medium">
            These details will show up next to each strategy created by this
            account. You can change your account information at any time in My
            Account.
          </Text>
        </div>
        <Text variant="body-3-semibold">Account Name</Text>
        <Input />
        <Text variant="body-3-semibold">Image</Text>
        <ImgCropUpload
          className="!w-full !h-[166px] !bg-none bg-white"
          value={""}
          setValue={() => console.log(1)}
        ></ImgCropUpload>
      </div>
    </Container>
  );
};

export default Metadata;
