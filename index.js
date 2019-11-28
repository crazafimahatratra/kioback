let Initialisation = require('./initialisation');
let initializer = new Initialisation();
let express = require("express");
let bodyParser = require('body-parser');
let Agent = require('./models/Agent');
let Operation = require('./models/Operation')

let agentModel = new Agent();
let operationModel = new Operation();

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.route('/status').get((_request, response) => {
    response.json({ 'status': 'online' });
})

app.route('/agents')
    .get(agentModel.all)
    .post((request, response) => { agentModel.create(request, response) });

app.route('/agents/:id')
    .put(agentModel.update)
    .delete(agentModel.delete);

app.route('/retraits')
    .get((request, response) => { operationModel.getByType(request, response, 'R'); })
    .post((request, response) => operationModel.create(request, response, 'R'));

app.route('/retraits/:id')
    .put((request, response) => operationModel.update(request, response, 'R'))
    .delete((request, response) => operationModel.delete(request, response, 'R'));

app.route('/depots')
    .get((request, response) => { operationModel.getByType(request, response, 'D'); })
    .post((request, response) => operationModel.create(request, response, 'D'));

app.route('/depots/:id')
    .put((request, response) => operationModel.update(request, response, 'D'))
    .delete((request, response) => operationModel.delete(request, response, 'D'));

app.route('/stats/operation/:date')
    .get(operationModel.statsByDate)

initializer.init().then(() => {
    var server = app.listen(8080, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log("Server Listening on http://%s:%s", host, port);
    });
});