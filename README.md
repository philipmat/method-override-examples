# Examples of using ExpressJS's method-override with HTML FORMs

One attempting to write ExpressJS routes to support
the canonical HTTP verbs of `GET`, `POST`, `PUT`, and `DELETE`,
finds themselves soon at odds with HTML's lack of support
for `PUT` and `DELETE` in `FORM`'s `method` attribute.

```js
app.get('/resource', (req, res) => {
    ...
})
.post('/resource', (req, res) => {
    ...
})
.put('/resource', (req, res) => {
    ...
})
.delete('/resource/:id', (req, res) => {
    ...
})
```

This is where [method-override](https://github.com/expressjs/method-override), a wonderful piece of
ExpressJS middleware, comes to help. Here are
three strategies one can use to simulate the missing HTTP verbs.

## Using Query String Parameters

Client code:
```html
<form action="/resouce?_method=PUT" method="POST">
...
</form>
```

Server-side code:
```js
var methodOveride = require('method-override');
app.use(methodOveride('_method'));
```

`POST`-ing to `/resource?_method=PUT` would trigger `method-override`
to examine the query string for the presence of `_method` key -
as configured in `app.use(methodOveride('_method'));` line,
detect its value of `PUT`, and thus force ExpressJS to use
the `.put('/resource', ...)` route instead.


## Using FORM fields

In this example, instead of hosting the special indicator in the
query string, we'll use a form field, typically and `INPUT type="hidden"`
field.

Client code:
```html
<form action="/resource/42" method="POST" enctype="application/x-www-form-urlencoded">
  <input type="hidden" name="_method" value="DELETE" />
...
</form>
```

The server-side code is a little bit more complicated in this
case, but it yields the same result: ExpressJS will use the
`.delete('/resource/:id', ...)` route instead of the 
`.post('/resource'...)` route.
```js
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
```

## Using AJAX

A third, but very common case is to submit form data using
`XmlHttpRequest` aka AJAX call.

All modern browsers support `PUT` and `DELETE` in the `method`
parameter of `xhr.open(method, url)`, but in case one has to
deal with older browsers, `method-override` offers the ability
to specify the verb in an HTTP header.

Client code:
```js
var xhr = new XMLHttpRequest();
xhr.open('POST', '/resource/42', true);
xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
xhr.onload = ...
xhr.send();
```

The server-side code consists of configuring `method-override`
to monitor the specified header:

```js
app.use(methodOverride('X-HTTP-Method-Override'));
```


## Demo

Run `node app.js`, open the browser to http://localhost:3000/,
and watch the console output as you click around the buttons
on the page.


