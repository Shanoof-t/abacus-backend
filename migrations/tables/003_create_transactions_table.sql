-- DROP TABLE IF EXISTS transactions;

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