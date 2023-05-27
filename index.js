const express = require('express')
const app = express()
const port = 3000

const db = require('./src/db.js')
const cookieParser = require('cookie-parser')

app.set('trust proxy', true)
app.use(express.json());
app.use(express.static('public'))
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.auth
  if (token === undefined) {
    res.locals.authed = false
    next()
    return
  }

  var sessions = db.get_data().sessions
  if (sessions === undefined) {
    sessions = []
  }

  const id = sessions[token]
  if (id === undefined) {
    res.locals.authed = false
  } else {
    res.locals.authed = true
    res.locals.user_id = id
  }

  next()
})

app.get('/', (_, res) => {
  authed = res.locals.authed
  if (authed) {
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

const cookie_options = {
  maxAge: 360000,
  path: '/',
  sameSite: 'strict',
  secure: true,
  httpOnly: true,
}

app.get('/login', (_, res) => {
  res.sendFile('/login.html', {root: './public' })
})

app.get('/register', (_, res) => {
  res.sendFile('/register.html', {root: './public' })
})

app.get('/home', (_, res) => {
  res.sendFile('/home.html', {root: './public' })
})

app.post('/api/register', (req, res) => {
  if (req.body.first === undefined) {
    res.status(400).send('Missing first name')
    return
  }
  if (req.body.last === undefined) {
    res.status(400).send('Missing last name')
    return
  }
  if (req.body.username === undefined) {
    res.status(400).send('Missing username')
    return
  }
  if (req.body.email === undefined) {
    res.status(400).send('Missing email')
    return
  }
  if (req.body.password === undefined) {
    res.status(400).send('Missing password')
    return
  }
  const[code, msg, token] = db.register(
    req.body.first,
    req.body.last,
    req.body.email,
    req.body.username,
    req.body.password
  )
  res.cookie('auth', token, cookie_options).status(code).send(msg)
  return
})

app.post('/api/login', (req, res) => {
  if (req.body.username === undefined) {
    res.status(400).send('Missing username')
    return
  }
  if (req.body.password === undefined) {
    res.status(400).send('Missing password')
    return
  }
  const[code, msg, token] = db.login(
    req.body.username,
    req.body.password
  )
  res.cookie('auth', token, cookie_options).status(code).send(msg)
})

app.get('/api/posts', (_, res) => {
  const [code, result] = db.get_posts()
  res.status(code).send(result)
})

app.use((_, res, next) => {
  if (!res.locals.authed) {
    res.status(401).send("Unauthorized")
    return
  }
  next()
})

app.post('/api/post', (req, res) => {
  if (req.body.content === undefined || typeof req.body.content !== 'string' || req.body.content.length >= 256) {
    res.status(400).send('Missing content')
    return
  }

  const [code, result] = db.create_post(
    res.locals.user_id,
    req.body.content
  )
  res.status(code).send(result)
})

app.post('api/user', (req, res) => {
  if (req.body.user_id === undefined || typeof req.body.user_id != 'number' || req.body.user_id < 0) {
    res.status(400).send('Missing user id')
    return
  }
  const [code, result] = db.get_user(req.body.user_id)
  res.status(code).send(result)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})