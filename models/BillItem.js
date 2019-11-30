let Sequelize = require('sequelize');
let sequelize = require('../connection');

class BillItem extends Sequelize.Model {
    /**
     * Create a new billitem
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    create(request, response) {
        let body = request.body
        BillItem.create({bill_id: body.bill_id, operation_id: body.operation_id, qty: body.qty, price: body.price}).then(row => {
            response.json(row);
        }).catch(error => {
            response.status(400).json(error);
        })
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