import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import type { SwitchProps } from "@/components/ui/switch";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/app/use-theme";
export const ThemeSwitcher: FC<SwitchProps> = ({ className, ...props }) => {
  const theme = useTheme();
  return (
    <Switch
      noThumb
      className={cn(
        className,
        "data-[state=checked]:bg-primary-300 data-[state=unchecked]:bg-[#033A5D]",
      )}
      style={{
        backgroundImage: `url(/images/toggle/${theme.dark ? "dark" : "light"}.svg)`,
        backgroundSize: "44px",
        backgroundPosition: "center",
      }}
      {...props}
      checked={!theme.dark}
      onCheckedChange={() => {
        useTheme.state.dark = !useTheme.state.dark;
      }}
    >
      {/* {theme.dark ? (
        <BsFillMoonStarsFill className="size-4 text-yellow-500" />
      ) : (
        <MdSunny />
      )} */}
    </Switch>
  );
};

ThemeSwitcher.displayName = "ThemeSwitcher";
