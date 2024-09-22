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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { operatorLogoSchema } from "@/lib/zod/operator";
import { zodResolver } from "@hookform/resolvers/zod";
import { camelCase, isEqual, mapKeys } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useForm } from "react-hook-form";
import { FaCircleInfo } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { z } from "zod";
import { MultipleSelector } from "@/components/ui/multi-select2";

const sanitizedString = z.string().regex(/^[a-zA-Z0-9_!$#’|\s]*$/, {
  message: "Only letters, numbers, and special characters are allowed.",
});

export const metadataScheme = z.object({
  logo: operatorLogoSchema.default(""),
  name: sanitizedString
    .min(3, "Operator name must be at least 3 characters")
    .max(30, "Operator name must be at most 30 characters"),
  description: sanitizedString.optional().default(""),
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
      return [...acc, values[key]];
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
          {/* <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operator Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="shadcn"
                    {...logoRef}
                    onChange={(event) => {
                      field.onChange(event.target?.files ?? undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      className={inputVariants({ className: "text-base" })}
                    >
                      <SelectValue placeholder="Select your server geolocation" />
                    </SelectTrigger>
                    <SelectContent className="font">
                      {operatorLocations.data?.map((country) => (
                        <SelectItem
                          key={country["iso_3166-2"]}
                          value={country.name}
                        >
                          {country.name} ({country["alpha-3"]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      className={inputVariants({ className: "text-base" })}
                    >
                      <SelectValue placeholder="Geth, Nethermind, Besu..." />
                    </SelectTrigger>
                    <SelectContent className="font">
                      {["Erigon", "Besu", "Nethermind", "Geth"].map((node) => (
                        <SelectItem key={node} value={node}>
                          {node}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      className={inputVariants({ className: "text-base" })}
                    >
                      <SelectValue
                        placeholder="Prism, Lighthouse, Teku..."
                        className="text-gray-200"
                      />
                    </SelectTrigger>
                    <SelectContent className="font">
                      {[
                        "Lodestar",
                        "Nimbus",
                        "Teku",
                        "Lighthouse",
                        "Prysm",
                      ].map((node) => (
                        <SelectItem key={node} value={node}>
                          {node}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
