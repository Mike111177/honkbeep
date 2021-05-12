import "jest";

//Custom Matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSet(): R;
      toHaveUniqueSize(expected: number): R;
    }
  }
}

expect.extend({
  toBeSet(received) {
    const pass = received.length === new Set(received).size;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to contain only unique elements`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to contain only unique elements`,
        pass: false,
      };
    }
  },
});

expect.extend({
  toHaveUniqueSize(received, expected) {
    const uniqueSize = new Set(received).size;
    const pass = expected === uniqueSize;
    if (pass) {
      return {
        message: () =>
          `Error: expect(received).toHaveUniqueSize(expected)


           Expected unique size: not ${expected}
           Received unique size: ${uniqueSize}
                 Received array: ${received}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `Error: expect(received).toHaveUniqueSize(expected)


        Expected unique size: ${expected}
        Received unique size: ${uniqueSize}
              Received array: ${received}`,
        pass: false,
      };
    }
  },
});
