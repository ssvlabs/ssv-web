import type { RequestSSVError } from "@/api";
import { getFaucetConfig, requestSSV } from "@/api";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { useMutation, useQuery } from "@tanstack/react-query";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";
import { useTheme } from "@/hooks/app/use-theme";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router";
import { Collapse } from "react-collapse";

export const Request = () => {
  const captchaRef = useRef(null);
  const [canRequest, setCanRequest] = useState(false);
  const { dark } = useTheme();
  const { chain, address } = useAccount();
  const navigate = useNavigate();

  const amountQuery = useQuery({
    queryKey: ["faucet-amount"],
    queryFn: () => getFaucetConfig(),
  });
  console.log("amountQuery:", amountQuery);

  const requestMutation = useMutation<unknown, RequestSSVError, void>({
    mutationFn: () => requestSSV(address!),
    onSuccess: () => {
      toast({
        title: "SSV requested successfully",
      });
      navigate("/success");
    },
    onError: (error) => {
      if (
        error.response?.data.error.message &&
        /depleted/i.test(error.response?.data.error.message)
      ) {
        navigate("/depleted");
      } else {
        toast({
          title: "Error requesting SSV",
          variant: "destructive",
          description:
            error.response?.data.error.message +
            " " +
            error.response?.data.error.messages.join(" "),
        });
      }
    },
  });

  const isReachedLimit = Boolean(
    requestMutation.error?.response?.data.error.message &&
      /reached max transactions/i.test(
        requestMutation.error?.response?.data.error.message,
      ),
  );

  return (
    <Container className="max-w-[648px] py-8">
      <Card>
        <Text variant="headline4">SSV Faucet {chain?.name} Testnet</Text>
        <div className="flex flex-col gap-2">
          <Text variant="body-3-semibold" className="text-gray-500">
            Recipient Wallet
          </Text>
          <Input className="w-full" disabled value={address} />
        </div>
        <div className="flex flex-col gap-2">
          <Text variant="body-3-semibold" className="text-gray-500">
            Request Amount
          </Text>
          <Input
            className="w-full"
            disabled
            isLoading={amountQuery.isLoading}
            value={
              amountQuery.isSuccess
                ? `${amountQuery.data?.at(0)?.amount_to_transfer} SSV`
                : "0 SSV"
            }
          />
          {amountQuery.isError && (
            <Text variant="body-3-semibold" className="text-error-500">
              Error fetching amount
            </Text>
          )}
        </div>
        <Collapse isOpened={requestMutation.isError}>
          <Text variant="body-3-semibold" className="text-error-500">
            {requestMutation.error?.response?.data.error.message}
          </Text>
        </Collapse>
        <HCaptcha
          ref={captchaRef}
          theme={dark ? "dark" : "light"}
          onVerify={() => setCanRequest(true)}
          sitekey={String(import.meta.env.VITE_CAPTCHA_KEY)}
        />
        <Button
          size="xl"
          disabled={(!canRequest || isReachedLimit) && !import.meta.env.DEV}
          className="w-full"
          isLoading={requestMutation.isPending}
          onClick={() => requestMutation.mutate()}
        >
          Request
        </Button>
      </Card>
    </Container>
  );
};
