import { render } from "@testing-library/react";
import { Pip } from ".";

test("Renders pips without error", () => {
  render(<Pip shape={"Square"} size={0} />);
});
