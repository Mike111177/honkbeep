import { ComponentPropsWithoutRef } from "react";
import { CardSVG } from "../../components/DrawCard";
import { ZonePath, useZone } from "../../Zone";

//Helper to make card targets
type CardTargetProps = {
  areaPath: ZonePath;
} & ComponentPropsWithoutRef<"svg">;
export default function CardTarget({
  areaPath,
  children,
  ...props
}: CardTargetProps) {
  return (
    <CardSVG ref={useZone(areaPath)} {...props}>
      {children}
    </CardSVG>
  );
}
