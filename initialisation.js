let fs = require('fs');
let path = require('path');
let sequelize = require('./connection')

module.exports = class Initialisation {
    migrationsPath = "migrations";

    /**
     * Initialize database
     */
    init() {
        console.log("Initialisation database");
        let p1 = sequelize.authenticate();
        let p2 = this.createTableMigration();
        let p3 = this.getMigratedData();
        return Promise.all([p1, p2, p3]).then((result) => {
            fs.readdirSync(this.migrationsPath).filter((f) => { return f.endsWith(".sql") }).sort().forEach((file) => {
                this.migrateFile(file);
            })
        })
    }

    /**
     * Create the table migration
     * in database
     * @returns {Promise}
     */
    createTableMigration() {
        return sequelize.query("CREATE TABLE IF NOT EXISTS migration(id INTEGER PRIMARY KEY AUTOINCREMENT, migration varchar(255), seq INTEGER NOT NULL)");
    }

    /**
     * Get previously migrated queries
     * @returns {Promise}
     */
    getMigratedData() {
        return sequelize.query("SELECT * FROM migration", { type: sequelize.QueryTypes.SELECT }).then((result) => {
            this.migrated = result;
        });
    }

    /**
     * Migrate the sql contained in the `file`
     * @param {string} file Filename
     */
    migrateFile(file) {
        let filename = path.join(this.migrationsPath, file);
        let content = fs.readFileSync(filename).toString();
        let sequence = 1;
        content.split(';').filter((s) => { return s.trim().length > 0 }).forEach((sql) => {
            let done = this.migrated.filter((m) => {
                return m.migration == file && m.seq == sequence
            }).length > 0;
            console.log(`Migration of ${file} ${sequence} : ${done ? 'Already migrated' : 'OK'} ***`);
            if (!done) {
                sequelize.query(sql).then(() => {
                    sequelize.query("INSERT INTO migration(migration, seq) VALUES(?, ?)", { replacements: [file, sequence++] });
                });
            }
        });
    }
}