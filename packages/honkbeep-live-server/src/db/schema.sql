-- Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR ( 25 ) UNIQUE NOT NULL,
	displayName VARCHAR ( 25 ) UNIQUE NOT NULL,
	password CHAR ( 60 ) NOT NULL
);

-- Session Table
CREATE TABLE IF NOT EXISTS sessions (
	sess_id CHAR ( 36 ) PRIMARY KEY,
    user_id INT REFERENCES accounts ON DELETE CASCADE
);

-- Variants Table
CREATE TABLE IF NOT EXISTS variants (
	variant_id serial PRIMARY KEY,
	name VARCHAR ( 25 ) UNIQUE,
	displayName VARCHAR ( 25 ) UNIQUE,
	definition json NOT NULL
);

-- Official Variants
CREATE TABLE IF NOT EXISTS official_variants (
	rank SERIAL PRIMARY KEY,
	variant_id INT REFERENCES variants ON DELETE RESTRICT
);

-- Games Table
CREATE TABLE IF NOT EXISTS games (
	game_id SERIAL PRIMARY KEY,
	variant_id INT REFERENCES variants,
	events json
);

-- Game Participant Table
CREATE TABLE IF NOT EXISTS game_participants (
	game_id INT REFERENCES games ON DELETE CASCADE,
	user_id INT REFERENCES accounts,
	player_slot SMALLINT NOT NULL,
	UNIQUE (game_id, user_id),
	PRIMARY KEY (game_id, player_slot)
);

