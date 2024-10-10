import { useState, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { CopyBtn } from "@/components/ui/copy-btn";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { BeaconchainBtn } from "@/components/ui/ssv-explorer-btn";

export const SlashingWarning: FC = () => {
  const [agree1, setAgree1] = useState(false);
  const { shares } = useRegisterValidatorContext();

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Card className="font-medium">
        <div className="space-y-2">
          <Text variant="headline4">Slashing Warning</Text>
          {shares.length === 1 && (
            <>
              <Text className="font-semibold text-sm text-gray-500 w-fit">
                Validator Public Key
              </Text>
              <Input
                disabled
                value={shares[0].publicKey}
                rightSlot={
                  <div className="flex gap-1">
                    <CopyBtn className="size-7" text={shares[0].publicKey} />
                    <BeaconchainBtn validatorId={shares[0].publicKey} />
                  </div>
                }
              />
            </>
          )}
        </div>
        <Text variant="body-2-medium">
          Running a validator simultaneously to the SSV network will cause
          slashing to your validator.
        </Text>
        <Text variant="body-2-medium">
          To avoid slashing, shut down your existing validator setup (if you
          have one) before importing your validator to run with our network.
        </Text>
        <label htmlFor="agree-1" className="flex gap-3">
          <Checkbox
            checked={agree1}
            id="agree-1"
            className="mt-1"
            onCheckedChange={(checked: boolean) => setAgree1(checked)}
          />
          <Text variant="body-2-medium">
            I understand that running my validator simultaneously in multiple
            setups will cause slashing to my validator
          </Text>
        </label>
        <Button as={Link} to="../confirmation" size="xl" disabled={!agree1}>
          Next
        </Button>
      </Card>
    </Container>
  );
};

SlashingWarning.displayName = "SlashingWarning";
