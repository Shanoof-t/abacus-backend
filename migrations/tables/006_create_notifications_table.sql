
CREATE TABLE
    IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        message VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        status status_enum DEFAULT 'PENDING',
        is_read BOOLEAN NOT NULL DEFAULT false,
        is_server_notification BOOLEAN NOT NULL DEFAULT false,
        future_payload VARCHAR(255)
    )