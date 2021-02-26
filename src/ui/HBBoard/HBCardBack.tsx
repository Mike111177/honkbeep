import { ComponentProps } from "react";

type HBCardBackProps = {
  suits: string[];
} & ComponentProps<"svg">;

export default function HBCardBack({ suits, ...props }: HBCardBackProps) {
  return <></>;  
}
