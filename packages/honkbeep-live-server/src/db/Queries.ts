export const createTables = `
CREATE TABLE IF NOT EXISTS accounts (
	user_id serial PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 50 ) NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
	sess_id serial PRIMARY KEY,
  user_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES accounts (user_id)
);
`;
