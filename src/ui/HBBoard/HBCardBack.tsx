import { ComponentProps } from "react";

type HBCardBackProps = {
  suits: string[];
} & ComponentProps<"svg">;

export default function HBCardBack({ suits, ...props }: HBCardBackProps) {
  return (
    <svg {...props}>
      <defs>
        <filter id="outline">
          <feComponentTransfer>
            <feFuncR type="linear" slope="0" />
            <feFuncG type="linear" slope="0" />
            <feFuncB type="linear" slope="0" />
          </feComponentTransfer>
          <feMorphology operator="dilate" radius="1" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="5%" y="5%" width="90%" height="90%" fill="#cccccc" strokeWidth="2.5%" stroke="#777777" rx="5%" />
    </svg>
  );
}
