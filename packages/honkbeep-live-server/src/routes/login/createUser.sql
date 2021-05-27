INSERT INTO accounts (username, password) 
VALUES ($1, $2) 
RETURNING user_id