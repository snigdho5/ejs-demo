const express = require('express');
const app = express();
const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

var routes = require('./routes/routes.js');
var web = require('./routes/web.js');
var api = require('./routes/api.js');


app.use('/routes', routes);
// app.use('/', web);
// app.use('/api', api);




app.listen(port, () => console.log(`App listening on port ${port}!`));