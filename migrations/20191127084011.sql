CREATE TABLE agent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero VARCHAR (10) NOT NULL UNIQUE,
    name VARCHAR (255) NOT NULL
);