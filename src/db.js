const fs = require('fs')
const crypto = require('crypto'); 

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
    const user_id = db.emails[email]
    var user = db.users[user_id]
    user.user_id = user_id
    return user
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
    const user_id = db.usernames[username]
    var user = db.users[user_id]
    user.user_id = user_id
    return user
}

const get_user = (user_id) => {
    var db = get_data()
    var users = db.users
    if (users === undefined) {
        return [404, {}]
    }

    if (users.length <= user_id) {
        return [404, {}]
    }

    return [200, users[user_id]]
}

const get_posts = () => {
    var db = get_data()
    var posts = db.posts

    if (posts == undefined) {
        return [200, []]
    } else {
        return [200, posts]
    }
}

const sanitize = (input) => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const create_hash = (input) => {
    var sha = crypto.createHash('sha512')
    sha.update(input)
    return sha.digest('hex')
}

const login = (username, password) => {
    username = sanitize(username)
    password = sanitize(password)

    user = get_user_by_username(username)
    if (user === undefined) {
        return [400, 'Username does not exist']
    }

    const hash = create_hash(password + user.user_id)
    if (user.password !== hash) {
        return [400, 'Password does not match']
    }

    var db = get_data()
    if (db.sessions == undefined) {
        db.sessions = {}
    }

    const token = crypto.randomUUID()
    db.sessions[token] = user.user_id
    
    write_data(db)

    return [201, 'Successfully logged in', token]
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

    var db = get_data()
    if (db.users == undefined) {
        db.users = []
    }

    if (db.emails == undefined) {
        db.emails = {}
    }

    if (db.usernames == undefined) {
        db.usernames = {}
    }

    if (db.sessions == undefined) {
        db.sessions = {}
    }

    const user_id = db.users.length
    const hash = create_hash(password + user_id)

    db.emails[email] = user_id
    db.usernames[username] = user_id
    db.users.push({
        first,
        last,
        email,
        username,
        password: hash
    })

    const token = crypto.randomUUID()
    db.sessions[token] = user_id

    write_data(db)

    return [201, 'Successfully registered user', token]
}

const create_post = (user_id, content) => {
    var db = get_data()

    if (db.posts === undefined) {
        db.posts = []
    }

    var post_id = db.posts.length

    db.posts.push({
        user_id,
        post_id,
        content
    })

    write_data(db)

    return [201, 'Successfully created post']
}

module.exports = {
    get_data,
    get_posts,
    get_user,
    login,
    register,
    create_post
}