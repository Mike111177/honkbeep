function setDefault(key: string, value: string) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
    console.debug(`Using default value for ENV variable ${key}: ${value}`);
  }
}
export function checkEnvironment() {
  //This program also responds to any postgress enviroment variables defined here:
  //https://www.postgresql.org/docs/9.1/libpq-envars.html
  setDefault("HONKBEEP_PORT", "3001");
}
