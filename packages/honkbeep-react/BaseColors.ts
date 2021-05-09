import colors from "./colors.json";

export default function getBaseColor(name: string): string {
  const color = colors.find((e) => e.name === name);
  if (color === undefined) throw new Error(`Unknown base color '${name}'`);
  return color.color;
}
