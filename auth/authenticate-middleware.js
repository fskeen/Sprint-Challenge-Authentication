/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets')

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
          console.log('TOKEN ------- ', token)
          console.log('JWTSECRET ------- ', secrets.jwtSecret)
          console.log('DECODEDTOKEN ------- ', decodedToken)
          console.log('err ------- ', err)
            if (err) {
                res.status(401).json({message: 'Nice try!!'})
            } else {
                req.user = { username: decodedToken.username };
            }
        })
        next();
    } else {
        res.status(401).json({message: "You shall not pass!"})
    }
};
