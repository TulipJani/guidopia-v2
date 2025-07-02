var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();
require('./config/passport');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Allow requests from your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://guidopia-v2.vercel.app'],
  credentials: true, // Allow cookies and sessions
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Stop the server if DB connection fails
  });

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', require('./routes/auth'));
const userRoutes = require('./routes/user');
const futuremeRoutes = require('./routes/futureme');
app.use('/api/user', userRoutes);
app.use('/api/futureme', futuremeRoutes);
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);
const onboardingRoutes = require('./routes/onboarding');
app.use('/api/onboarding', onboardingRoutes);
const counselingRoutes = require('./routes/counseling');
app.use('/api', counselingRoutes);
const assessmentRoutes = require('./routes/assessment');
app.use('/api/assessment', assessmentRoutes);
const futureMeStepperRouter = require('./routes/futureMeStepper');
app.use('/api/futureme-stepper', futureMeStepperRouter);
const purchasesRouter = require('./routes/purchases');
app.use('/api/purchases', purchasesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
