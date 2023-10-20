// Import express
const express = require('express');
const db = require('./config/connection');
const methodOverride = require('method-override');

const { engine } = require('express-handlebars');

const session = require('express-session');

// Import our view_routes
const view_routes = require('./controllers/view_routes');
const user_routes = require('./controllers/user_routes');
const dashboard_routes = require('./controllers/dashboard_routes');
const blog_routes = require('./controllers/blog_routes');
const comment_routes = require('./controllers/comment_routes');

// Create the port number and prepare for heroku with the process.env.PORT value
const PORT = process.env.PORT || 3333;

// Create the server app
const app = express();

// Middleware

// Open the static channel for our browser assets - ie. express.static on the public folder
// This is now the root folder of /
app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

// Handlebars setup
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// Load session middleware
app.use(session({ 
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Load our view routes at the root level '/'
app.use('/', [view_routes, dashboard_routes, blog_routes, comment_routes]);
app.use('/auth', user_routes);

// Start the server and log the port that it started on
db.sync( { force: false })
 .then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
 });