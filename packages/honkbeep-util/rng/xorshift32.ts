function autoSeed() {
  return Math.floor(Math.random() * 0xffffffff);
}

export default class xorshift32 {
  private a: number; //Javascript does bitwise ops on signed_32's
  private seed: number;
  constructor(seed: number | undefined = undefined) {
    this.seed = seed ?? autoSeed();
    this.a = this.seed;
  }
  next() {
    let x = this.a;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    this.a = x;
    return this.a >>> 0; //Convert to unsigned_32 before returning
  }
  getSeed() {
    return this.seed;
  }
}
