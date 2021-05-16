const dotenv = require("dotenv");
const result = dotenv.config({ path: "../../.env" });
if (result.error) {
  module.exports = {};
} else {
  const { parsed: envs } = result;
  console.log("Loaded from .env:", envs);
  module.exports = envs;
}
