---
to: src/ui/components/<%=name%>/<%=name%>.stories.tsx
---
import { Meta, Story } from "@storybook/react";

import <%=name%>, { <%=name%>Props } from ".";

export default {
  title: "Components/<%=name%>",
  component: <%=name%>,
} as Meta;

export const <%=name%>Story: Story<<%=name%>Props> = (props) => (
  <<%=name%> {...props}/>
);
<%=name%>Story.storyName = "<%=name%>";
