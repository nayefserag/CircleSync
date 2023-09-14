const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.hashPassword = async (pasword) => {
    const salt = await bcrypt.genSalt(10);
    const hasedpassword = await bcrypt.hash(pasword, salt);
    return hasedpassword;
};

exports.generateToken = (id, isAdmin) => {
    const token = jwt.sign({
        id: id,
        isAdmin: isAdmin
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    return token;
}
exports.refreshToken = (id, isAdmin) => {
    const token = jwt.sign({
        id: id,
        isAdmin: isAdmin
    }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
    return token;
}

// exports.comparePasswords=async (req,res ,password,hasedpassword) =>{
//     const isMatch =await bcrypt.compare(password, hasedpassword);
//     if (!isMatch) {
//         res.status(401).json('Invalid password');

//     }
//     return isMatch;
// }

exports.extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    return [...text.matchAll(hashtagRegex)].map((match) => match[1]);
  };