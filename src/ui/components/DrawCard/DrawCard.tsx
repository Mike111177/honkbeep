import React from "react";
import {
  CardFront,
  CardBack,
  CardIcon,
  CardBackProps,
  CardFrontProps,
  CardIconProps,
} from ".";

type CardPropsForFront = CardFrontProps & { icon?: false };
type CardPropsForBack = CardBackProps & { icon?: false };
type CardPropsForIcon = CardIconProps & { icon: true };
export type CardProps = CardPropsForFront | CardPropsForBack | CardPropsForIcon;

export const DrawCard = React.memo(function DrawCard({
  icon,
  ...props
}: CardProps): JSX.Element {
  if (icon) {
    return <CardIcon {...(props as CardIconProps)} />;
  } else if ("card" in props) {
    return <CardFront {...(props as CardFrontProps)} />;
  } else {
    return <CardBack {...(props as CardBackProps)} />;
  }
});
