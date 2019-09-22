// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// create express app
const app = express();
// Import tokens
require('dotenv/config');

// Middleswares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('app/tf_model'));
app.use(
	function(req, res, next) {
		console.log('Request URL:', req.originalUrl);
		next();
	},
	function(req, res, next) {
		console.log('Request Type:', req.method);
		next();
	},
	function(req, res, next) {
		console.log('Request body:', req.body);
		next();
	}
);
// Database configuration
const mongoose = require('mongoose');

// Import routes
const tweetsRoute = require('./app/routes/tweets');

app.use('/api/', tweetsRoute);

// Connect to database
mongoose
	.connect(process.env.DB_CONNECTION, {
		useNewUrlParser: true
	})
	.then(() => {
		console.log('Successfully connected to the database');
	})
	.catch(err => {
		console.log('Couldn\'t connect to the database. Exiting now', err);
		process.exit();
	});

// add static resources
app.use('/models', express.static('resources'));

app.listen(5000, () => {
	console.log('Server is listening on port 5000');
});
