import React from "react";
import { CardFront, CardBack, CardBackProps, CardFrontProps } from ".";

type CardPropsForFront = CardFrontProps;
type CardPropsForBack = CardBackProps;
export type CardProps = CardPropsForFront | CardPropsForBack;

export const DrawCard = React.memo(function DrawCard(
  props: CardProps
): JSX.Element {
  if ("face" in props) {
    return <CardFront {...(props as CardFrontProps)} />;
  } else {
    return <CardBack {...(props as CardBackProps)} />;
  }
});
