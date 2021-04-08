import { ComponentPropsWithRef, ReactChild } from "react";
import classNames from "../../util/classNames";
import styles from "./BoxButton.css";

export type BoxButtonProps = {
  children: ReactChild;
} & ComponentPropsWithRef<"div">;
export default function BoxButton({
  children,
  className,
  ...props
}: BoxButtonProps) {
  return (
    <div className={classNames(styles.BoxButton, className)} {...props}>
      {children}
    </div>
  );
}
