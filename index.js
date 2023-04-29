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

app.get('/', (req, res) => {
  authed = true//res.locals.authed
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

app.get('/login', (req, res) => {
  res.sendFile('/login.html', {root: './public' })
})

app.get('/register', (req, res) => {
  res.sendFile('/register.html', {root: './public' })
})

app.get('/home', (req, res) => {
  res.sendFile('/home.html', {root: './public' })
})

app.post('/register', (req, res) => {
  
})

app.post('/api/register', (req, res) => {
  if (req.body.first === undefined) {
    res.status(400).send('Missing first name')
  }
  if (req.body.last === undefined) {
    res.status(400).send('Missing last name')
  }
  if (req.body.username === undefined) {
    res.status(400).send('Missing username')
  }
  if (req.body.email === undefined) {
    res.status(400).send('Missing email')
  }
  if (req.body.password === undefined) {
    res.status(400).send('Missing password')
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
  }
  if (req.body.password === undefined) {
    res.status(400).send('Missing password')
  }
  const[code, msg, token] = db.login(
    req.body.username,
    req.body.password
  )
  res.cookie('auth', token, cookie_options).status(code).send(msg)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})