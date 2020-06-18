const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config()

var url = example.env.MONGOLAB_URI;

const app = express();

const ejs = require("ejs");
var cors = require('cors');
const phone_verification = require('./routes/verify-phone-number')
const example = require('./routes/example');
require('./routes/transactions.js')(app);

app.use(cors());

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(url, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.set("view engine", "ejs");

app.use(phone_verification)
app.use(example)

app.listen(5000, () => {
    console.log(`app running on port: http://localhost:5000`);
});

