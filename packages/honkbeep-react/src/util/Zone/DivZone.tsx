import { ComponentPropsWithoutRef } from "react";
import { ZoneConfig, ZonePath, useZone } from ".";

type DivZoneProps = {
  areaPath: ZonePath;
  config?: ZoneConfig;
} & ComponentPropsWithoutRef<"div">;
export function DivZone({
  areaPath,
  config,
  children,
  ...props
}: DivZoneProps) {
  return (
    <div ref={useZone(areaPath, config)} {...props}>
      {children}
    </div>
  );
}
