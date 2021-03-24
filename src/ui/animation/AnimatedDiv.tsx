import {
  ComponentPropsWithoutRef,
  CSSProperties,
  useMemo,
  useRef,
} from "react";
import AnimatedNumber from "./AnimatedNumber";

type AnimatedDivProps = Omit<ComponentPropsWithoutRef<"div">, "style"> & {
  style: any;
};
export default function AnimatedDiv({ style, ...props }: AnimatedDivProps) {
  const ref = useRef<HTMLDivElement>(null);
  const divStyle = useMemo(() => {
    const outStyle: any = {};
    const oldStyle = style as any;
    if (oldStyle !== undefined) {
      for (let key in Object.getOwnPropertyNames(style)) {
        const value = oldStyle[key];
        if (value instanceof AnimatedNumber) {
          outStyle[key] = value.value;
        } else {
          outStyle[key] = value;
        }
      }
    }
    return outStyle as CSSProperties;
  }, [style]);
  return <div ref={ref} {...props} style={divStyle}></div>;
}
