DROP TABLE IF EXISTS transactions;

DROP TYPE IF EXISTS transaction_type_enum CASCADE;

DROP TYPE IF EXISTS recurring_enum CASCADE;

CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');

CREATE TYPE recurring_enum AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

CREATE TABLE
    IF NOT EXISTS transactions (
        id SERIAL NOT NULL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        transaction_date TIMESTAMPTZ NOT NULL,
        account_name VARCHAR(255) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        transaction_amount NUMERIC(18, 2) NOT NULL,
        transaction_type transaction_type_enum NOT NULL,
        transaction_payee VARCHAR(255) NOT NULL,
        transaction_note TEXT,
        is_recurring BOOLEAN DEFAULT false,
        recurring_frequency recurring_enum,
        next_date TIMESTAMPTZ,
        is_estimated BOOLEAN NOT NULL DEFAULT false,
        is_bank_transaction BOOLEAN DEFAULT false
    )