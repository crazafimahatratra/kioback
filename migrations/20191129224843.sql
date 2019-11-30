CREATE TABLE bill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num VARCHAR (64) UNIQUE,
    date DATE NOT NULL,
    customer VARCHAR (64) NOT NULL,
    address VARCHAR (64) NOT NULL
);

PRAGMA foreign_keys = 0;

CREATE TABLE sqlitestudio_temp_table AS
SELECT
    *
FROM
    operation;

DROP TABLE operation;

CREATE TABLE operation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER REFERENCES agent (id) ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL,
    operation_type VARCHAR (64) NOT NULL,
    date DATETIME NOT NULL,
    reference VARCHAR (64) NOT NULL UNIQUE,
    customer VARCHAR (10) NOT NULL,
    amount INTEGER NOT NULL,
    commission INTEGER NOT NULL,
    bill_id INTEGER REFERENCES bill (id)
);

INSERT INTO
    operation (
        id,
        agent_id,
        operation_type,
        date,
        reference,
        customer,
        amount,
        commission
    )
SELECT
    id,
    agent_id,
    operation_type,
    date,
    reference,
    customer,
    amount,
    commission
FROM
    sqlitestudio_temp_table;

DROP TABLE sqlitestudio_temp_table;

PRAGMA foreign_keys = 1;