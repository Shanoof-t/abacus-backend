-- DROP TABLE IF EXISTS users;

CREATE TABLE
    IF NOT EXISTS users (
        id SERIAL NOT NULL UNIQUE PRIMARY KEY,
        user_name VARCHAR(225),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN NOT NULL DEFAULT false,
        picture TEXT,
        is_google BOOLEAN NOT NULL DEFAULT false,
        google_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    )