---
to: src/ui/components/<%=name%>/<%=name%>.tsx
---
import { <%=name%>Styles as styles } from ".";

export type <%=name%>Props = {};
export default function <%=name%>(props: <%=name%>Props) {
  return <div className={styles.<%=name%>} {...props}></div>;
}
