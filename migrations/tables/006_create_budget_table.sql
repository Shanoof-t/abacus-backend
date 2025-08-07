CREATE TABLE
    IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        budget_name VARCHAR(255) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        amount_limit NUMERIC(18, 2) NOT NULL,
        budget_start_date TIMESTAMPTZ NOT NULL,
        budget_end_date TIMESTAMPTZ NOT NULL,
        notification_status BOOLEAN NOT NULL,
        budget_note VARCHAR(255),
        alert_threshold INTEGER,
        total_spent NUMERIC(18, 2) NOT NULL DEFAULT 0,
        progress INTEGER NOT NULL
    )