module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: ["**/.{js,jsx,ts,tsx}", "!**/*.d.ts"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/fileTransformer.js",
    "\\.(css|less)$": "identity-obj-proxy",
  },
};
