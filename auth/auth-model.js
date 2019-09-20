const db = require('../database/dbConfig');

module.exports = {
    createAccount,
    findBy,
    getProtectedResource
}

function findAccount(id) {
    return db('users')
        .where('id', id)
        .first();
}

function createAccount(account) {
    return db('users')
        .insert(account)
        .then(ids => findAccount(ids[0]))
}

function findBy (username) {
    return db('users').where(username);
}

function getProtectedResource () {
    return db('users').select('username')
}