const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');
const dbConfig = require('../database/dbConfig');

const server = express();

const sessionConfig = {
    name: 'chocochip',
    secret: process.env.SESSION_SECRET || 'WOLOLO',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: dbConfig, 
        createtable: true,
        tablename: 'knexsessions',
        sidfieldname: 'sessionsid',
        clearInterval: 1000 * 60 * 30,
    })
};
server.use(session(sessionConfig));

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;
