module.exports = {
  "plugins": [
    "react-hooks"
  ],
  "rules": {
    //General
    "semi": ["warn", "always", { "omitLastInOneLineBlock": true }],
    //Typescript
    "@typescript-eslint/member-delimiter-style": ["warn", {
      "multiline": { "delimiter": "semi", "requireLast": true },
      "singleline": { "delimiter": "semi", "requireLast": false }
    }],
    //React
    "react/no-unknown-property": "error",
    //Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "extends": [
    "eslint:recommended",
    "react-app",
    "react-app/jest"
  ]
};
