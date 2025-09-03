CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    prompt VARCHAR(255) NOT NULL,
    answer JSONB NOT NULL,
    answer_type conversation_answer_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW (),
    updated_at TIMESTAMPTZ DEFAULT NOW ()
);