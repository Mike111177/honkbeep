import { ComponentPropsWithoutRef } from "react";
import { CardSVG } from "../../components/DrawCard";
import { ZonePath, useZone, ZoneConfig } from "react-zones";

//Helper to make card targets
type CardTargetProps = {
  areaPath: ZonePath;
  config?: ZoneConfig;
} & ComponentPropsWithoutRef<"svg">;
export default function CardTarget({
  areaPath,
  children,
  config,
  ...props
}: CardTargetProps) {
  return (
    <CardSVG ref={useZone(areaPath, config)} {...props}>
      {children}
    </CardSVG>
  );
}
