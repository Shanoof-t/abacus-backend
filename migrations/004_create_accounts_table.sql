CREATE TYPE account_source_enum AS ENUM ('manual', 'bank_integration', 'both');

CREATE TABLE
    IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        account_name VARCHAR(255) NOT NULL,
        account_balance BIGINT NOT NULL DEFAULT 0,
        account_source account_source_enum DEFAULT 'manual'
    )