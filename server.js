import express from 'express'
import exphbs from 'express-handlebars'
import moment from 'moment'
import session from 'express-session'
import flash from 'express-flash'
import path from 'path'
import dotenv from 'dotenv'
import morgan from 'morgan'

import MongoDatabase from './database/MongoDatabase'

import users from './routes/users'
import snippets from './routes/snippets'
import { getXLatest } from './controllers/snippets'

const developmentMode = process.env.NODE_ENV === 'development'
const PORT = process.env.PORT || 5000
dotenv.config()

const app = express()
const mdb = new MongoDatabase(process.env.MONGO_URI)

mdb.connect()

/* Configure Handlebars as View Engine.
*  Configures helpers for handlebars.
*/
app.engine('.hbs', exphbs({
  extname: '.hbs',
  helpers: {
    formatRelative: (date) => moment(date).fromNow(),
    formatCalendar: (date) => moment(date).calendar(),
    formatSimple: (date) => moment(date).format('lll')
  }
}))
app.set('view engine', '.hbs')

/* Middleware */
/* Logger */
if (developmentMode) {
  app.use(morgan('tiny'))
}
// Initialize Session
app.use(
  session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 72000,
      sameSite: true
    }
  })
)
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})
// Flash
app.use(flash())

// Delete flash from session
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  next()
})

/* Body Parser */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* Set Static Path */
app.use(express.static(path.join(__dirname, 'public')))

/* Routes */
app.get('/', async (req, res) => {
  const data = await getXLatest()
  res.render('home', data)
})
app.use('/users', users)
app.use('/snippets', snippets)

/* Routes all not recognized GET requests to a 404 View. */
app.get('*', (req, res) => {
  res.status(404).render('errors/404')
})

/* Start Express Server */
app.listen(PORT, console.log(`Server running on port ${PORT}`))
