CREATE TABLE IF NOT EXISTS accounts (
	user_id serial PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password CHAR ( 60 ) NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
	sess_id CHAR ( 36 ) PRIMARY KEY,
    user_id int NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts (user_id)
);