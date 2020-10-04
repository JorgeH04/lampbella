if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} 

const { format } = require('timeago.js');
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const sassMiddleware=require('node-sass-middleware');


const MongoStore = require('connect-mongo')(session);
// Initializations   <%= session.cart.totalQty %>
const app = express();
require('./database');
require('./config/passport');
const middleware=require('./config/middleware');



//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');


// middlewares
app.use(sassMiddleware({
  src : './assets/scss',
  dest :'./assets/css',
  debug : true,
  outputStyle : 'extended',
  prefix : '/css'
}))

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(middleware.setFlash);


// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.session = req.session;
  //res.locals.carro = req.flash('carro');
  res.locals.user = req.user || null;
  next();
})




// routes
app.use(require('./routes'));
app.use(require('./routes/users'));
app.use(require('./routes/ofertauno'));
app.use(require('./routes/ofertados'));
app.use(require('./routes/ofertatres'));
app.use(require('./routes/produno'));
app.use(require('./routes/proddos'));
app.use(require('./routes/prodtres'));
app.use(require('./routes/prodcuatro'));
//app.use(require('./routes/prodcinco'));
//app.use(require('./routes/prodseis'));


// server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});