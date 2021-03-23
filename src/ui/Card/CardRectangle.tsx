export type CardRectangleProps = {
  background: string;
  border: string;
};

export function CardRectangle({ background, border }: CardRectangleProps) {
  const shape = { x: "5%", y: "5%", width: "90%", height: "90%", rx: "5%" };
  return (
    <>
      <rect {...shape} fill={background} />
      <rect {...shape} fill="none" strokeWidth="6%" stroke="black" />
      <rect {...shape} fill="none" strokeWidth="3.5%" stroke={border} />
    </>
  );
}
