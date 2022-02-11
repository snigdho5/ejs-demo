var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function (req, res) {
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


router.get('/about', function (req, res) {
    res.render('pages/about');
});

// router.route('/book')
//     .get(function (req, res) {
//         res.send('Get a random book');
//     })
//     .post(function (req, res) {
//         res.send('Add a book');
//     })
//     .put(function (req, res) {
//         res.send('Update the book');
//     });


module.exports = router;