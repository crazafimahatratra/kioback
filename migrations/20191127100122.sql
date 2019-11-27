CREATE TABLE operation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER REFERENCES agent (id) ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL,
    operation_type VARCHAR(64) NOT NULL,
    date DATETIME NOT NULL,
    reference VARCHAR (64) NOT NULL UNIQUE,
    customer VARCHAR (10) NOT NULL,
    amount INTEGER NOT NULL,
    commission INTEGER NOT NULL
);