import { useState, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { CopyBtn } from "@/components/ui/copy-btn";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";

export const SlashingWarning: FC = () => {
  const [agree1, setAgree1] = useState(false);
  const { shares } = useRegisterValidatorContext();

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Card className="font-medium">
        <Text variant="headline4">Slashing Warning</Text>
        {shares.length === 1 && (
          <>
            <Text>Validator Public Key</Text>
            <Input
              disabled
              value={shares[0].publicKey}
              rightSlot={
                <div className="flex">
                  <CopyBtn text={shares[0].publicKey} />
                  <SsvExplorerBtn validatorId={shares[0].publicKey} />
                </div>
              }
            />
          </>
        )}
        <Text>
          Running a validator simultaneously to the SSV network will cause
          slashing to your validator.
        </Text>
        <Text>
          To avoid slashing, shut down your existing validator setup (if you
          have one) before importing your validator to run with our network.
        </Text>
        <label htmlFor="agree-1" className="flex gap-3 pt-6">
          <Checkbox
            checked={agree1}
            id="agree-1"
            className="mt-1"
            onCheckedChange={(checked: boolean) => setAgree1(checked)}
          />
          <Text>
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
