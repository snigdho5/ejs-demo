const express = require('express');
const app = express();
const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

var routes = require('./routes.js');
app.use('/', routes);



app.listen(port, () => console.log(`App listening on port ${port}!`));