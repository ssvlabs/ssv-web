import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { useLinks } from "@/hooks/use-links";
import { FaDiscord } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const Depleted = () => {
  const { chain } = useAccount();
  const links = useLinks();
  return (
    <Container className="max-w-[648px] py-8">
      <Card>
        <Text variant="headline4">SSV Faucet {chain?.name} Testnet</Text>
        <Text variant="headline4" className="text-primary-500 max-w-[440px]">
          Sorry, unfortunately the faucet has depleted for the time being.
        </Text>
        <Text variant="body-2-medium" className="max-w-[400px]">
          Please try again at a later time or jump to our discord to ask the
          community for help.
        </Text>
        <Button
          as={Link}
          to={links.ssv.discord}
          target="_blank"
          size="xl"
          className="w-full"
        >
          <FaDiscord className="size-6 mr-2" />
          Go to Discord
        </Button>
      </Card>
    </Container>
  );
};
