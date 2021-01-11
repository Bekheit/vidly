const { func } = require('joi');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');;

module.exports = function(params) {
    winston.exceptions.handle( new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // winston.add(new winston.transports.MongoDB({ 
    //     db: 'mongodb://localhost/vilda',
    //     level: 'info'
    // }));
}
    


