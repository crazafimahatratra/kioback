CREATE TABLE bill (
    id       INTEGER      PRIMARY KEY AUTOINCREMENT,
    num      VARCHAR (64) UNIQUE,
    date     DATE         NOT NULL,
    customer VARCHAR (64) NOT NULL,
    address  VARCHAR (64) NOT NULL
);
