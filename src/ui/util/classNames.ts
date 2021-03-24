type NameOrCondition = string | boolean | undefined;
type ClassNamesParameters = [string | undefined, ...NameOrCondition[]];
export default function classNames(...nC: ClassNamesParameters): string {
  const names = [];
  for (let i = 0; i < nC.length; i++) {
    let thisItem = nC[i];
    let nextItem = nC[i + 1];
    if (
      typeof thisItem === "string" &&
      (typeof nextItem !== "boolean" || nextItem !== false)
    ) {
      names.push(thisItem);
    }
  }
  return names.join(" ");
}
