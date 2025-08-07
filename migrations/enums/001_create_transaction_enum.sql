DROP TYPE IF EXISTS transaction_type_enum CASCADE;

DROP TYPE IF EXISTS recurring_enum CASCADE;

CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');

CREATE TYPE recurring_enum AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
