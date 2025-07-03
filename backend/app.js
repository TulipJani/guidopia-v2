var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Add this package
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

// Trust proxy for production
app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration - MUST be before session
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://guidopia-psi.vercel.app',
    'https://guidopia-v2.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Fixed session configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'guidopia.sid'
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
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;