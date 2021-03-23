import React from "react";

import { CARD_VIEWBOX } from ".";

import styles from "./Card.module.css";

export type CardSVGProps = {
  children?: React.ReactNode;
} & React.ComponentProps<"svg">;
export const CardSVG = React.forwardRef<SVGSVGElement, CardSVGProps>(
  function CardSVG({ children, className, ...props }, ref) {
    return (
      <svg
        className={[styles.Card, className].join(" ")}
        ref={ref}
        viewBox={CARD_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        {...props}
      >
        {children}
      </svg>
    );
  }
);
