const express = require('express');
const session = require('express-session'); // Import express-session
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Set up the session
app.use(session({
    secret: 'simple_secret',
    resave: false,
    saveUninitialized: true
}));

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
