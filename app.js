var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));

// by default method-override only looks at POST.
// if you wanted to use _method=DELETE in GET requests,
// you could configure as below, but it's highly recommended
// that you *never* do this (precaching, crawling, etc could 
// all inadvertently delete records)
// app.use(methodOverride('_method', { methods: ['GET', 'POST'] }));

// need body-parser to be able to retrieve FORM POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/log', function(req, res) {
  console.log(":: GET /log");
  res.redirect('/');
})
.post('/log', function(req, res) {
  console.log(":: POST /log");
  res.redirect('/');
})
.put('/log', function(req, res) {
  console.log(":: PUT /log");
  res.redirect('/');
})
.delete('/log', function(req, res) {
  console.log(":: DELETE /log");
  res.redirect('/');
});

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT + '!');
});