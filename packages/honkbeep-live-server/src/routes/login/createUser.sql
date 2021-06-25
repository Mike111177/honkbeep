INSERT INTO accounts (username, displayName, password) 
VALUES (LOWER($1), $1, $2) 
RETURNING user_id