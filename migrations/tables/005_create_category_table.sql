CREATE TABLE
    IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        is_bank_category BOOLEAN DEFAULT false
    )