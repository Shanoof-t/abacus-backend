DROP TYPE IF EXISTS account_source_enum CASCADE;

CREATE TYPE account_source_enum AS ENUM ('manual', 'bank_integration', 'both');
