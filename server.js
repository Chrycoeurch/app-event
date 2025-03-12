const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/results', (req, res) => {
  res.render('results');
});

app.post('/submit', (req, res) => {
  res.json({ success: true, data: req.body });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});