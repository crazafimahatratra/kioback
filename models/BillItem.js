let Sequelize = require('sequelize');
let sequelize = require('../connection');
let Operation = require('./Operation');

class BillItem extends Sequelize.Model {
    /**
     * Create a new billitem
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    create(request, response) {
        let body = request.body
        Operation.findOne({
            where: { id: body.operation_id }
        }).then((operation) => {
            if (operation == null) {
                response.status(400).json({
                    error: `Operation ${body.operation_id} does not exists`
                });
            } else {
                BillItem.create({ bill_id: body.bill_id, operation_id: body.operation_id, qty: 1, price: operation.amount }).then(row => {
                    response.json(row);
                }).catch(error => {
                    response.status(400).json(error);
                })
            }
        }).catch(error => response.status(400).json(error));
    }
}

BillItem.init({
    bill_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    operation_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'bill_item',
    freezeTableName: true,
    timestamps: false
});

module.exports = BillItem;