const winston =require('winston')

module.exports = function(err ,req, res, next) { 
    winston.log(err.message,err)
    res.status(500).send(err.message);
}