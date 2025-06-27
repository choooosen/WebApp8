const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const app = express(); // 💡 Jetzt korrekt definiert

// View-Engine einrichten (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Statische Dateien aus "public" & "uploads" bereitstellen
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routen
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blog', blogRouter);

// 404-Fehlerbehandlung
app.use(function (req, res, next) {
  next(createError(404));
});

// Fehler-Handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  // Unterschiedliche Ausgabe je nach Umgebung
  if (req.app.get('env') === 'development') {
    res.render('error', {
      message: err.message,
      error: err
    });
  } else {
    res.render('error', {
      message: err.message,
      error: {}
    });
  }
});

module.exports = app;
