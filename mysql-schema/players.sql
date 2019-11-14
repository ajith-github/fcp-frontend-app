CREATE TABLE players (
    player_id varchar(64) NOT NULL,
    player_name varchar(128) NOT NULL,
    gender varchar(16) NOT NULL,
    age integer NOT NULL,
    created_at timestamp(3) NOT NULL,
    updated_at timestamp(3) NOT NULL,
    created_by varchar(128) NOT NULL,
    updated_by varchar(128) NOT NULL,
    PRIMARY KEY (player_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
