import { DOMAttributes } from "react";

export type Recognizer = Omit<
  DOMAttributes<HTMLElement>,
  "children" | "dangerouslySetInnerHTML" | "css"
>;
