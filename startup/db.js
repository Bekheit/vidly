const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

const db = config.get('db');
module.exports = function(){
    mongoose
    .connect(db , { useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true})
    .then(() => winston.info(`Connected to ${db}`))
    .catch((err) => console.log(err));
}
