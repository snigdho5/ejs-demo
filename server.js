const express = require('express');
const app = express();
const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

// app.get('/', function (req, res) {
//     res.render('pages/index');
// });

app.get('/about', function (req, res) {
    res.render('pages/about');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));