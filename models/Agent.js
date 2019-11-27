let Sequelize = require('sequelize');
let sequelize = require('../connection')

class Agent extends Sequelize.Model {
    /**
     * Get all agents
     * @param {Request} request request
     * @param {Response} response HTTP response
     */
    all(_request, response) {
        Agent.findAll().then((r) => { response.json({rows: r}) }).catch(err => response.status(400).json(err));
    }

    /**
     * Create an agent
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    create(request, response) {
        Agent.findOne({where: {numero: request.body.numero}}).then(row => {
            if(row == null) {
                Agent.create({ numero: request.body.numero, name: request.body.name }).then(row => {
                    response.json(row);
                }).catch(err => response.status(400).json(err));
            } else {
                response.status(400).json({ error: {numero: "Ce numero existe deja" }});
            }
        }).catch(err => json.status(400).json(err));
    }

    /**
     * Updates a row
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    update(request, response) {
        let id = request.params.id;
        Agent.findOne({where: {numero: request.body.numero}}).then(row => {
            if(row != null && row.id != id) {
                response.status(400).json({ error: {numero: "Ce numero existe deja" }});
            } else {
                Agent.update({ numero: request.body.numero, name: request.body.name }, {where: {id: id}})
                .then(row => response.json(row))
                .catch(err => response.status(400).json(err));
            }
        }).catch(err => response.status(400).json(err));
    }

    /**
     * Deletes a row
     * @param {Request} request HTTP Request
     * @param {Response} response HTTP Response
     */
    delete(request, response) {
        let id = request.params.id;
        Agent.destroy({where: {id: id}}).then(res => response.json(res)).catch(err => response.status(400).json(err));
    }
}

Agent.init({
    // attributes
    numero: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'agent',
    freezeTableName: true,
    timestamps: false
});

module.exports = Agent;