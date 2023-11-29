var express  = require('express');
var path = require('path');
const fs = require('fs');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var port     =  3000;
const customHelpers = require('./custom_helper');

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(express.static(path.join(__dirname, 'public'))); // tellig the express that use the public folder to get the static files from the project. path join is used to join current directoty path to public.

const hbs = exphbs.create({
    handlebars: customHelpers,
    extname: '.hbs', 
    partialsDir: path.join(__dirname, 'views/partials'),
});

hbs.handlebars.registerPartial('header', fs.readFileSync(path.join(__dirname, 'views/partials/header.hbs'), 'utf8'));
hbs.handlebars.registerPartial('footer', fs.readFileSync(path.join(__dirname, 'views/partials/footer.hbs'), 'utf8'));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); //  Set 'hbs' as the view engine for rendering templates.



mongoose.connect(database.url, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false });



var Movies = require('./models/movies');
 
 


app.get('/', function (req, res) {
  res.send('Successfully!  "Final Project Connected."');
});

app.listen(port);
console.log("App listening on port : " + port);