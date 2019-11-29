CREATE TABLE bill (
    id       INTEGER      PRIMARY KEY AUTOINCREMENT,
    num      VARCHAR (64) UNIQUE,
    date     DATE         NOT NULL,
    customer VARCHAR (64) NOT NULL,
    address  VARCHAR (64) NOT NULL
);

CREATE TABLE bill_item (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_id      INTEGER REFERENCES bill (id) ON DELETE CASCADE
                                              ON UPDATE CASCADE,
    operation_id INTEGER REFERENCES operation (id) ON DELETE CASCADE
                                                   ON UPDATE CASCADE,
    qty          INTEGER NOT NULL,
    price        INTEGER NOT NULL
);
