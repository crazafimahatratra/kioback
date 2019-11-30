let Sequelize = require('sequelize');
let sequelize = require('../connection')
let moment = require('moment');
let BillItem = require('./BillItem');

class Bill extends Sequelize.Model {
    /**
     * Get all bills
     * @param {Request} request request
     * @param {Response} response HTTP response
     */
    all(_request, response) {
        Bill.findAll().then((r) => { response.json({ rows: r }) }).catch(err => { console.log(err); response.status(400).json(err) });
    }

    /**
     * Create a new bill
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    create(request, response) {
        let body = request.body;
        let num = `F${moment().format('YYYYMMDDHHmmss')}`;
        Bill.create({ num: num, date: body.date, customer: body.customer, address: body.address }).then(r => {
            response.json(r);
        }).catch(e => { response.status(400).json(e) });
    }

    /**
     * Get one bill by id
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    row(request, response) {
        let id = request.params.id;
        Bill.findOne({
            where: { id },
            include: [{ model: BillItem }]
        }).then(row => response.json(row)).catch(error => response.status(400).json(error));
    }
}

Bill.init({
    // attributes
    num: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    customer: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'bill',
    freezeTableName: true,
    timestamps: false
});
Bill.hasMany(BillItem, { foreignKey: 'bill_id' });
module.exports = Bill;