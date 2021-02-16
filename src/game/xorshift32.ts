function autoSeed() {
    return Math.floor(Math.random() * 0xFFFFFFFF);
}

export default class xorshift32 {
    #a: number; //Javascript does bitwise ops on signed_32's
    constructor(seed: number | undefined = undefined) {
        if (typeof(seed) === "undefined") {
            this.#a = autoSeed();
        } else {
            this.#a = seed;
        }
    }
    next() {
        let x = this.#a;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        this.#a = x;
        return this.#a>>>0;//Convert to unsigned_32 before returning
    }
}