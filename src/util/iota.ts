export default function iota(length: number): number[] {
  return [...Array(length).keys()];
}
