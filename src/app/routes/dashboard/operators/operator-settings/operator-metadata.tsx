import type { OperatorMetadata as IOperatorMetadata } from "@/api/operator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, inputVariants } from "@/components/ui/input";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";

import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { useOperatorLocations } from "@/hooks/operator/use-operator-locations";
import { useSignOperatorMetadata } from "@/hooks/operator/use-sign-operator-metadata";
import { useOperator } from "@/hooks/operator/use-operator";
import {
  MEV_RELAY_OPTIONS,
  SORTED_OPERATOR_METADATA_FIELDS,
  type OperatorMetadataFields,
} from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import { dgkURLSchema, httpsURLSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { camelCase, isEqual, mapKeys } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCircleInfo } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { z } from "zod";
import { MultipleSelector } from "@/components/ui/multi-select2";
import { Combobox } from "@/components/ui/combobox";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { sha256 } from "js-sha256";

const sanitizedString = z.string().regex(/^[a-zA-Z0-9_!$#’|\s]*$/, {
  message: "Only letters, numbers, and special characters are allowed.",
});

export const metadataScheme = z.object({
  logo: z
    .union([z.instanceof(File), z.string()])
    .transform(async (file: File | string) => {
      if (file instanceof File) {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = function (e) {
            if (e?.target?.readyState === FileReader.DONE) {
              const base64String = e.target.result as string;
              resolve(base64String);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } else {
        return "";
      }
    })
    .default(""),
  name: z
    .string()
    .min(3, "Operator name must be at least 3 characters")
    .max(30, "Operator name must be at most 30 characters"),
  description: z.string().optional().default(""),
  eth1_node_client: sanitizedString.optional().default(""),
  eth2_node_client: sanitizedString.optional().default(""),
  location: z.string().optional().default(""),
  mev_relays: z.array(sanitizedString).transform((val) => val.join(", ")),
  setup_provider: sanitizedString.optional().default(""),
  twitter_url: z.union([z.literal(""), httpsURLSchema]),
  website_url: z.union([z.literal(""), httpsURLSchema]),
  linkedin_url: z.union([z.literal(""), httpsURLSchema]),
  dkg_address: z.union([z.literal(""), dgkURLSchema]),
}) satisfies z.ZodObject<Record<OperatorMetadataFields, z.ZodTypeAny>>;

export const OperatorMetadata: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const navigate = useNavigate();
  const sign = useSignOperatorMetadata();

  const { data: operator } = useOperator();

  const operatorLocations = useOperatorLocations();

  const defaults = {
    ...operator,
    mev_relays:
      operator?.mev_relays
        ?.split(",")
        .map((val) => val.trim())
        .filter(Boolean) ?? [],
  };

  const form = useForm<
    z.infer<typeof metadataScheme> & { mev_relays: string[] }
  >({
    mode: "all",
    defaultValues: defaults,
    resolver: zodResolver(metadataScheme),
  });

  const isChange = !isEqual(defaults, form.getValues());

  const submit = (values: z.infer<typeof metadataScheme>) => {
    const message = SORTED_OPERATOR_METADATA_FIELDS.reduce((acc, key) => {
      if (!values[key]) return acc;
      let res = [...acc, values[key]];
      if (key === "logo") {
        res = [...acc, `logo:sha256:${sha256(values[key])}`];
      }
      return res;
    }, [] as string[]).join(",");
    const metadata = mapKeys(values, (_, key) => {
      if (key === "name") return "operatorName";
      return camelCase(key);
    }) as Omit<IOperatorMetadata, "signature">;
    sign
      .submit(operator!.id.toString(), {
        message,
        metadata,
      })
      .then(() => {
        navigate("..");
      });
  };

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const [uploadFile, setUploadFile] = useState<string | UploadFile>("");

  return (
    <Container variant="vertical" className={cn(className, "py-6")} {...props}>
      <NavigateBackBtn />
      <Form {...form}>
        <Card as="form" className="w-full" onSubmit={form.handleSubmit(submit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operator name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => {
              const fileList: UploadFile[] =
                typeof field.value === "string" &&
                operator?.logo &&
                operator?.logo === field.value
                  ? [
                      {
                        uid: "-1",
                        name: "image.png",
                        status: "done",
                        url: operator?.logo,
                      },
                    ]
                  : field.value
                    ? [field.value as unknown as UploadFile]
                    : [];
              return (
                <FormItem>
                  <FormLabel>Operator Image</FormLabel>
                  <div className="flex items-center gap-6">
                    <ImgCrop rotationSlider>
                      <Upload
                        className={
                          fileList.length === 0
                            ? `bg-[url('/images/operator_default_background/light.svg')] rounded-[8px] bg-cover bg-center`
                            : ""
                        }
                        beforeUpload={() => false}
                        listType="picture-card"
                        fileList={
                          uploadFile ? [uploadFile as UploadFile] : fileList
                        }
                        onChange={async (file) => {
                          if (file.file.status === "removed") {
                            field.onChange("");
                            setUploadFile("");
                          } else {
                            field.onChange(file.file);
                            setUploadFile(file.fileList[0]);
                          }
                        }}
                        onPreview={onPreview}
                      >
                        {fileList.length === 0 && (
                          <p className="text-primary-500 font-semibold text-xs">
                            Add Image
                          </p>
                        )}
                      </Upload>
                    </ImgCrop>
                    <div className="font-medium text-[14px] text-gray-500">
                      <div>Image should be:</div>
                      <div>
                        Square and at least 400 x 400 px | Max size: 200 kb |
                        Format: JPG, PNG
                      </div>
                    </div>
                  </div>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="setup_provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cloud Provider</FormLabel>
                <FormControl>
                  <Input placeholder="AWS, Azure, Google Cloud..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mev_relays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mev Relays</FormLabel>
                <FormControl>
                  <MultipleSelector
                    placeholder="MEV Relays"
                    items={MEV_RELAY_OPTIONS}
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Geolocation</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select your server geolocation"
                    options={(operatorLocations.data || []).map((country) => ({
                      value: country.name,
                      label: `${country.name} (${country["alpha-3"]})`,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eth1_node_client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Execution Client</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    placeholder="Geth, Nethermind, Besu..."
                    options={["Erigon", "Besu", "Nethermind", "Geth"].map(
                      (node) => ({
                        value: node,
                        label: node,
                      }),
                    )}
                    className={inputVariants({ className: "text-base" })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eth2_node_client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consensus Client</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    placeholder="Prism, Lighthouse, Teku..."
                    options={[
                      "Lodestar",
                      "Nimbus",
                      "Teku",
                      "Lighthouse",
                      "Prysm",
                    ].map((node) => ({
                      value: node,
                      label: node,
                    }))}
                    className={inputVariants({ className: "text-base" })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Website Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Twitter Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linkedin</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Linkedin Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dkg_address"
            render={({ field }) => (
              <FormItem>
                <Tooltip
                  content={`The IP address or domain name of the machine running the operator DKG client, along with the port number ("3030" is the default port). Example: "https://192.168.1.1:3030 or "https://my.example.com:3030"`}
                >
                  <FormLabel className="flex gap-2 items-center">
                    <Text>DKG Endpoint</Text>
                    <FaCircleInfo className="size-4 text-gray-500" />
                  </FormLabel>
                </Tooltip>
                <FormControl>
                  <Input placeholder="Enter your Website Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="xl"
            isLoading={sign.isPending}
            type="submit"
            disabled={!isChange}
          >
            Sign Metadata
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

OperatorMetadata.displayName = "OperatorMetadata";
