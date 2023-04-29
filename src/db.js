const fs = require('fs')
const { createHash, randomUUID } = import('crypto');

const get_data = () => {
    const file = fs.readFileSync('database.json')
    const db = JSON.parse(file)
    return db
}

const write_data = (db) => {
    const data = JSON.stringify(db)
    fs.writeFileSync('database.json', data)
}

const get_user_by_email = (email) => {
    const db = get_data()
    const users = db.users
    if (db.emails === undefined) {
        return undefined
    }
    if (db.emails[email] === undefined) {
        return undefined
    }
    return db.users[db.emails[email]]
}

const get_user_by_username = (username) => {
    const db = get_data()
    const users = db.users
    if (db.usernames === undefined) {
        return undefined
    }
    if (db.usernames[username] === undefined) {
        return undefined
    }
    return db.users[db.usernames[username]]
}

const sanitize = (input) => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const register = (first, last, email, username, password) => {
    first = sanitize(first)
    last = sanitize(last)
    email = sanitize(email)
    username = sanitize(username)
    password = sanitize(password)

    if (get_user_by_username(username) !== undefined) {
        return [400, 'The username is already in use']
    }

    if (get_user_by_email(email) !== undefined) {
        return [400, 'The email is already in use']
    }

    const db = get_data()
    if (db.users == undefined) {
        db.users = {}
    }

    if (db.emails == undefined) {
        db.emails = {}
    }

    if (db.usernames == undefined) {
        db.usernames = {}
    }

    const hash = createHash('sha512').update(password + user_id).digest();

    const user_id = users.length
    db.emails[email] = user_id
    db.usernames[username] = user_id
    db.users.push({
        first,
        last,
        email,
        username,
        password: hash
    })

    const token = randomUUID()
    db.sessions[token] = db.usernames[username]

    write_data(db)

    return [200, 'Successfully registered user', token]
}

const login = (username, password) => {
    username = sanitize(username)
    password = sanitize(password)

    user = get_user_by_username(username)
    if (user === undefined) {
        return [400, 'Username does not exist']
    }

    if (user.password !== password) {
        return [400, 'Password does not match']
    }

    if (db.sessions == undefined) {
        db.sessions = {}
    }

    const token = randomUUID()
    db.sessions[token] = db.usernames[username]
    
    write_data(db)

    return [200, 'Successfully logged in', token]
}

module.exports = {
    login,
    register,
    get_data,

}