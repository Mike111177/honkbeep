module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: ["**/.{js,jsx,ts,tsx}", "!**/*.d.ts"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};
