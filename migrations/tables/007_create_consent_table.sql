CREATE TABLE IF NOT EXISTS consent (
    id SERIAL PRIMARY KEY,
    consent_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    connected_accounts TEXT[] NOT NULL DEFAULT [],
    is_approved BOOLEAN NOT NULL DEFAULT false
);