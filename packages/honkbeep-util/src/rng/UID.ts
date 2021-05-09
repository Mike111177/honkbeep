import { xorshift32 } from ".";
import * as ArrayUtil from "../ArrayUtil";

const URL_SAFE_CHARS: Readonly<string> =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
const CHARS_LENGTH = URL_SAFE_CHARS.length;

export function UID(length: number = 8) {
  const rng = new xorshift32();
  return ArrayUtil.fill(
    length,
    () => URL_SAFE_CHARS[rng.next() % CHARS_LENGTH]
  ).join("");
}
