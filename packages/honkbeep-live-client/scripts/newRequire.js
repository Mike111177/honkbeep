module.exports = function newRequire(name, ...args) {
  const module = require(name);
  return new module(...args);
};
