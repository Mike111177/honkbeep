import React from "react";

import classNames from "../util/classNames";
import { CARD_VIEWBOX } from ".";

import styles from "./Card.css";

export type CardSVGProps = {
  children?: React.ReactNode;
} & React.ComponentProps<"svg">;
export const CardSVG = React.forwardRef<SVGSVGElement, CardSVGProps>(
  function CardSVG({ children, className, ...props }, ref) {
    return (
      <svg
        className={classNames(styles.Card, className)}
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
