const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const moment = require('moment')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
var methodOverride = require('method-override')

/********************************************************************/

const app = express()

/********************************************************************/

const hostname = '127.0.0.1'
const port = 3000

/********************************************************************/

mongoose.connect('mongodb://127.0.0.1/nodeblog_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

/********************************************************************/

const mongoStore = connectMongo(expressSession)

app.use(expressSession({
  secret: 'testotest',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection })
}))

/********************************************************************/

// ! FLASH - MESSAGE MIDDLEWARE

app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash
  delete req.session.sessionFlash
  next()
})

/********************************************************************/

app.use(fileUpload())

app.use(express.static('public'))

app.use(methodOverride('_method'))

/********************************************************************/

const hbs = exphbs.create({
  helpers: {
    generateDate: (date, format) => {
      return moment(date).format(format)
    }
  }
})

/********************************************************************/

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/********************************************************************/

// ! DISPLAY LINK MIDDLEWARE

app.use((req, res, next) => {
  const { userId } = req.session

  if (userId) {
    res.locals = {
      displayLink: true
    }
  } 
  else {
    res.locals = {
      displayLink: false
    }
  }
  next()
})

/********************************************************************/

const main = require('./routes/main')
const posts = require('./routes/posts')
const users = require('./routes/users')
const admin = require('./routes/admin/index')

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)


/*==============================================================
  ==============================================================
  ==============================================================*/


app.listen(port, hostname, () => {
  console.log(`Server is running http://${hostname}:${port}/`)
})