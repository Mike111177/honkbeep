export function classNames(
  ...nC: [string | undefined, ...(string | boolean | undefined)[]]
): string {
  return nC
    .filter(
      (v, i, arr) =>
        typeof v === "string" &&
        (typeof arr[i + 1] !== "boolean" || arr[i + 1] !== false)
    )
    .join(" ");
}

export default classNames;
