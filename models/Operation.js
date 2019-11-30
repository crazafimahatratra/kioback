let Sequelize = require('sequelize');
let sequelize = require('../connection');
let Agent = require('./Agent');

class Operation extends Sequelize.Model {
    /**
     * Get operations of type in a date
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     * @param {string} operation_type Type of operation : *R : Retrait*
     */
    getByType(request, response, operation_type) {
        let date = request.query.date;
        Operation.findAll({
            where: [
                sequelize.where(sequelize.col('operation_type'), operation_type),
                sequelize.where(sequelize.fn('substr', sequelize.col('date'), 1, 10), date)
            ],
            include: [Agent]
        })
            .then(rows => response.json({ rows: rows }))
            .catch(err => { console.log(err); response.status(400).json(err) });
    }

    /**
     * Get all available operations in a date
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    getAvailable(request, response) {
        let date = request.params.date;
        Operation.findAll({
            where: [
                sequelize.where(sequelize.fn('substr', sequelize.col('date'), 1, 10), date)
            ],
            include: [Agent]
        }).then(rows => response.json({ rows: rows }))
            .catch(err => { console.log(err); response.status(400).json(err) });
    }

    /**
     * Create operations of type `type`
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     * @param {string} operation_type Type of operation : *R : Retrait*
     */
    create(request, response, operation_type) {
        let body = request.body;
        body.operation_type = operation_type;
        Operation.findOne({ where: { reference: body.reference } }).then(row => {
            if (row == null) {
                Operation.create(body).then(row => response.json(row)).catch(err => response.status(400).json(err));
            } else {
                response.status(400).json({ error: { reference: "Cette reference existe deja" } });
            }
        }).catch(err => response.status(400).json(err));
    }

    /**
     * Update the operation of id
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     * @param {string} operation_type Type of operation : *R : Retrait*
     */
    update(request, response, operation_type) {
        let id = request.params.id;
        let body = request.body;
        Operation.findOne({ where: { reference: body.reference } }).then(row => {
            if (row != null && row.id != id) {
                response.status(400).json({ error: { numero: "Cette reference existe deja" } });
            } else {
                Operation.update(body, { where: { id: id, operation_type: operation_type } })
                    .then(row => response.json(row))
                    .catch(err => response.status(400).json(err));
            }
        }).catch((err) => { console.log(err); response.status(400).json(err) });
    }

    /**
     * Deletes an operation specified by id
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     * @param {string} operation_type Type of operation
     */
    delete(request, response, operation_type) {
        let id = request.params.id;
        Operation.destroy({ where: { id: id, operation_type: operation_type } }).then(res => response.json(res)).catch(err => response.status(400).json(err));
    }

    /**
     * Get data by date
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    statsByDate(request, response) {
        let date = request.params.date;
        sequelize.query(`select sum(amount) as amount, sum(commission) as commission, operation_type from operation O
        where substr(date, 1, 10) = ?
        group by operation_type`, { type: sequelize.QueryTypes.SELECT, replacements: [date] }).then((r) => {
            response.json(r);
        }).catch(e => response.status(400).json(e));
    }

    /**
     * Get data by operator
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    statsByOperator(request, response) {
        let date = request.params.date;
        sequelize.query(`select sum(amount) as amount, sum(commission) as commission, substr(customer, 1, 3) as operator from operation O
        where substr(date, 1, 10) = ?
        group by substr(customer, 1, 3)`, { type: sequelize.QueryTypes.SELECT, replacements: [date] }).then(r => {
            response.json(r);
        }).catch(e => response.status(400).json(e));
    }

    /**
     * Get data by year
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    statsByYear(request, response) {
        let year = request.params.year;
        sequelize.query(`select sum(amount) as amount, sum(commission) as commission, substr(date, 6, 2) as month, operation_type from operation
        where substr(date, 1, 4) = ?
        group by substr(date, 6, 2), operation_type order by month`, { type: sequelize.QueryTypes.SELECT, replacements: [year] }).then(r => {
            response.json(r);
        }).catch(e => response.status(400).json(e));
    }

}

Operation.init({
    agent_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    operation_type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    reference: {
        type: Sequelize.STRING,
        allowNull: false
    },
    customer: {
        type: Sequelize.STRING,
        allowNull: false
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    commission: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'operation',
    freezeTableName: true,
    timestamps: false
});

Operation.belongsTo(Agent, { foreignKey: 'agent_id' });
module.exports = Operation;