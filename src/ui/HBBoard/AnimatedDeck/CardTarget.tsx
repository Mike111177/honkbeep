import { ComponentPropsWithoutRef } from "react";
import { CardSVG } from "../../Card";
import { FloatAreaPath, useFloatArea } from "../../util/Floating";

//Helper to make card targets
type CardTargetProps = {
  areaPath: FloatAreaPath;
} & ComponentPropsWithoutRef<"svg">;
export default function CardTarget({
  areaPath,
  children,
  ...props
}: CardTargetProps) {
  return (
    <CardSVG ref={useFloatArea(areaPath)} {...props}>
      {children}
    </CardSVG>
  );
}
