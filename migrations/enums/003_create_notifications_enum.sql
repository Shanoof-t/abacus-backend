DROP TYPE IF EXISTS status_enum CASCADE;
DROP TYPE IF EXISTS notification_type_enum CASCADE;

CREATE TYPE status_enum AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TYPE notification_type_enum AS ENUM ('budget-alert', 'reccuring-alert');