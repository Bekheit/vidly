const winston = require('winston');

module.exports = function (err, req, res, next) {
    console.log(err.message, err)
    res.status(500).send('Something Failed.');
}