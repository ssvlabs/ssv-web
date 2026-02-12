import { ActiveBadge } from "@/components/operator/operator-permission/active-badge";
import { OperatorVisibilityBadge } from "@/components/operator/operator-permission/operator-visibility-badge";
import { PermissionSettingsItem } from "@/components/operator/operator-permission/permission-settings-item";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Tooltip } from "@/components/ui/tooltip";
import { globals, links } from "@/config";
import { useOperator } from "@/hooks/operator/use-operator";
import type { ComponentPropsWithoutRef, FC } from "react";
import { FaCircleInfo } from "react-icons/fa6";

export const OperatorSettings: FC<ComponentPropsWithoutRef<"div">> = () => {
  const { data: operator } = useOperator();

  const hasWhitelistingContract = Boolean(
    operator?.whitelisting_contract &&
      operator.whitelisting_contract !== globals.DEFAULT_ADDRESS_WHITELIST,
  );

  return (
    <Container variant="vertical" className="mt-6" size="lg">
      <NavigateBackBtn>{operator?.name}</NavigateBackBtn>
      <Card
        variant="unstyled"
        className="not-last:border-b not-last:border-gray-100 overflow-hidden"
      >
        <PermissionSettingsItem
          className="pt-8"
          title={
            <h2 className="text-xl flex items-center gap-2">
              <span>Permission Settings</span>
              <Tooltip
                content={
                  <div>
                    Learn more about{" "}
                    <a
                      href={links.PERMISSIONED_OPERATORS}
                      className="link text-primary-300"
                      target="_blank"
                    >
                      Permissioned Operators
                    </a>
                  </div>
                }
              >
                <FaCircleInfo className="size-4 text-gray-500" />
              </Tooltip>
            </h2>
          }
          description={
            <p>
              Use the options below to activate permissioned operator settings
              and restrict validator registration to whitelisted addresses only.
            </p>
          }
        />
        <PermissionSettingsItem
          title="Operator Status"
          description={
            "Switch between public and private modes for operator access control."
          }
          route="status"
          addon={<OperatorVisibilityBadge isPrivate={operator?.is_private} />}
        />
        <PermissionSettingsItem
          title="Authorized Addresses"
          description="Manage owner addresses authorized to register validators to your operator."
          route="authorized-addresses"
          addon={
            <ActiveBadge
              isActive={Boolean(operator?.whitelist_addresses?.length)}
            />
          }
        />
        <PermissionSettingsItem
          className="pb-8"
          title="External Contract"
          description="Manage whitelisted addresses through an external contract."
          addon={<ActiveBadge isActive={hasWhitelistingContract} />}
          route="external-contract"
        />
      </Card>
    </Container>
  );
};

OperatorSettings.displayName = "OperatorSettings";
