const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const creamCache = require('./helpers/creamCache.js');

const { slow } = require('./routes');

const app = express();
const PORT = 8080;

app.engine('.hbs', handlebars({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(creamCache);

app.use('/slow', slow);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  process.stdout.write(`server listening on port ${PORT}`);
});