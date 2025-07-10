DROP TABLE IF EXISTS one_time_password;

CREATE TABLE
    IF NOT EXISTS one_time_password (
        id SERIAL NOT NULL UNIQUE PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        otp VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW (),
        expires_at TIMESTAMP NOT NULL
    )