const {sendEmailReport} = require('../middleware/nodemailer');
const asyncMiddleware = require('../middleware/async.js');
const { getFileFromS3 } = require('../middleware/s3_service');
var { reportsname } = require('../startup/redis.js');
const {publisher} = require('../config/redis_config');
const config = require('../config');
async function sendToRadis(req,res,next){
    if(!req.body.email || !req.body.name ){
        res.json("Please Provide Email and Name").status(404);
    }
    else {
        publisher.publish(config.redis.subscriber, `${req.body.name}`);
        next();
    }
    
}
async function sendReport(req,res){
    const link = await getFileFromS3(req.body.name);
    await sendEmailReport(link , req.body.email , ` ${req.body.name} Report` ,req.body.name);
    if(!reportsname.includes(req.body.name)){
        res.json("Report sent Check your Email");
    }
    else{
        res.json("Report sent again Check your Email");
    }
}


module.exports = {
    sendReport : asyncMiddleware(sendReport),
    sendToRadis : asyncMiddleware(sendToRadis)
}