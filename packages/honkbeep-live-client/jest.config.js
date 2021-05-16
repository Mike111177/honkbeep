module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: ["**/.{js,jsx,ts,tsx}", "!**/*.d.ts"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "honkbeep-testing/transforms/fileTransformer.js",
    "\\.css$": "identity-obj-proxy",
    "\\.svg$": "honkbeep-testing/transforms/svgTransformer.js",
  },
};
