const express = require('express');
const app = express();
const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    var mascots = [
        { name: 'John', organization: "Java", birth_year: 2016 },
        { name: 'Smith', organization: "Linux", birth_year: 1995 },
        { name: 'Coby', organization: "Docker", birth_year: 2014 }
    ];
    var tagline = "Hello World!";

    res.render('pages/index', {
        mascots: mascots,
        tagline: tagline
    });
});

// app.get('/', function (req, res) {
//     res.render('pages/index');
// });

app.get('/about', function (req, res) {
    res.render('pages/about');
});


app.listen(port, () => console.log(`App listening on port ${port}!`));