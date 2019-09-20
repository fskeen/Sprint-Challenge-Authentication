const db = require('./auth-model')
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secrets = require('../config/secrets')
const restricted = require('./authenticate-middleware')

router.post('/register', (req, res) => {
  let account = req.body;
    account.password = bcrypt.hashSync(account.password, 14);

    db.createAccount(account)
        .then(user => {
            req.session.user = user;
            res.status(201).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "Error creating account."})
        })
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

    db.findBy({username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user)
            req.session.user = user;
            res.status(200).json({ message: `Welcome ${user.username}! Have a token: ${token}` });
        } else {
            res.status(401).json({ message: 'You cannot pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

function generateToken(user) {
  const payload = {
      username: user.username,
  };
  const options = {
      expiresIn: '1d',
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
