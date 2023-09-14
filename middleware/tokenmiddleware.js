const jwt = require('jsonwebtoken');
const il8n = require('../Localization/il8n.js');

exports.verifyToken = (req, res, next) => {
 
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const token = req.headers[process.env.TOKEN_NAME];

    if (!token) {
        return res.status(401).json({
            message: il8n.__('No-token')
        });
    }


    try {
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRE,function(err, decoded) {
            if (err) {
                if(err.name == "TokenExpiredError"){
                    var refreshedToken = jwt.sign({
                        success: true,
                        }, process.env.JWT_SECRE, {
                            expiresIn: '5m'
                        });
                }
            }

        });
        req.user = decoded;
       
        next();
    } catch (err) {
        
        return res.status(403).json({
            message:  il8n.__('Invalid-token')
        });
    }
};






exports.protectedRoute = async (req, res, next) => {
    const token = req.headers[process.env.TOKEN_NAME];

    if (!token) {
        return res.status(401).json({
            message: il8n.__('No-token')
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message:  il8n.__('Invalid-token')
            });
        }

        // res.json({ message: 'Protected route accessed successfully', user_id: decoded.id });
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({
            message:  il8n.__('Unauthorized')
        });
    }
    next();
}