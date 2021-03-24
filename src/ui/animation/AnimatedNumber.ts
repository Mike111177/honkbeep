import { Mutable } from "../../util/HelperTypes";

export default class AnimatedNumber {
  listeners: ((i: number) => void)[] = [];
  readonly value: number = 0;
  update(n: number) {
    (this as Mutable<AnimatedNumber>).value = n;
    this.listeners.forEach((f) => f(this.value));
  }
}
