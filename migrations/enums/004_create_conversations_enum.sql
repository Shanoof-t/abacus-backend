DROP TYPE IF EXISTS conversation_answer_enum CASCADE;

CREATE TYPE conversation_answer_enum AS ENUM ('user', 'bot');