---
to: src/ui/components/<%=name%>/<%=name%>.tsx
---
import styles from "./<%=name%>.module.css";

export type <%=name%>Props = {};
export default function <%=name%>(props: <%=name%>Props) {
  return (
    <div className={styles.<%=name%>} {...props}></div>
  );
}
