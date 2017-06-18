var express      = require('express')
var session      = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser   = require('body-parser')
var path         = require('path')
var mongoose     = require('mongoose')
var logger       = require('morgan')
var mongoStore   = require('connect-mongo')(session)

var port = process.env.PORT || 3000
var app  = express()

var dbUrl = 'mongodb://localhost/imooc'
mongoose.connect(dbUrl)

app.set('views', './app/views/pages')
app.set('view engine', 'jade')
// app.use(bodyParser.json)
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(session({
    secret: 'imooc',
    store : new mongoStore({
        url       : dbUrl,
        collection: 'sessions'
    })
}))

if ('development' === app.get('env')) {
    app.set('showStackError', true)
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
}

require('./config/routes')(app)

app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port ' + port)




