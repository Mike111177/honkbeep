module.exports = {
  plugins: ["react-hooks"],
  rules: {
    //React
    "react/no-unknown-property": "error",
    //Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "useBoardStateSelector|useBoardStateUpdates",
      },
    ],
  },
  extends: [
    "eslint:recommended",
    "react-app",
    "react-app/jest",
    "prettier",
    "plugin:json/recommended",
  ],
};
