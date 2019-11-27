let fs = require('fs');
let path = require('path');
let moment = require('moment');

console.log('Create migration file');
if(!fs.existsSync('migrations')) {
    fs.mkdirSync('migrations');
}

let date = moment().format('YYYYMMDDHHmmss');
let file = path.join('migrations', `${date}.sql`);
let f = fs.createWriteStream(file).close();