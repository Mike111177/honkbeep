SELECT sessions.user_id, username 
FROM sessions
INNER JOIN accounts 
ON accounts.user_id=sessions.user_id
WHERE sess_id=$1