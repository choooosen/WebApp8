var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Meine express Website', name: 'Thomas' });
});

router.get('/about', function(req, res, next) {
  res.json({ message: 'About Page' });
});

router.get('/udrei', function(req, res, next) {
  res.json({ message: 'Udrei Page' });
});

// Aufgabe 2: Route mit Query Parameters (muss vor den Parametern-Routen stehen)
router.get('/names', function(req, res, next) {
  const name = req.query.name;
  
  if (name) {
    res.send(`Hallo ${name}!`);
  } else {
    res.send('Kein Name angegeben. Verwenden Sie: /names?name=IhrName');
  }
});

// Aufgabe 3: Kombination von Parametern und Query Parameters
router.get('/combined/:year/:month/:day', function(req, res, next) {
  const year = req.params.year;
  const month = req.params.month;
  const day = req.params.day;
  const name = req.query.name;
  
   if (name) {
    res.send(`Hallo ${name}! Das Datum ist: ${day}.${month}.${year}`);
  } else {
    res.send(`Datum: ${day}.${month}.${year} - Kein Name angegeben. Verwenden Sie: /${year}/${month}/${day}/names?name=IhrName`);
  }
});

// Spezielle Route für Datum + name
router.get('/:year/:month/:day/names', function(req, res, next) {
  const year = req.params.year;
  const month = req.params.month;
  const day = req.params.day;
  const name = req.query.name;
  
    if (name) {
    res.send(`Hallo ${name}! Das Datum ist: ${day}.${month}.${year}`);
  } else {
    res.send(`Datum: ${day}.${month}.${year} - Kein Name angegeben. Verwenden Sie: /${year}/${month}/${day}/names?name=IhrName`);
  }
});

// Aufgabe 1: Route mit Parametern für Datum (muss ganz am Ende stehen)
router.get('/:year/:month/:day', function(req, res, next) {
  const year = req.params.year;
  const month = req.params.month;
  const day = req.params.day;
  
 res.send(`Jahr: ${year}, Monat: ${month}, Tag: ${day}`);
});

module.exports = router;