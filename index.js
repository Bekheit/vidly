const winston = require('winston');
const express = require('express');

const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod');

let server;

const port = process.env.PORT || 3000;
// if (process.NODE_ENV!='test')
    server = app.listen(port , () => winston.info(`listening on port: ${port}`));

module.exports = server;