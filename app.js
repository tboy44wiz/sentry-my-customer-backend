const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

var url = process.env.MONGOLAB_URI;

const app = express();

const ejs = require("ejs");
var cors = require('cors');
const documentation = require('./routes/documentation')
const phone_verification = require('./routes/verify-phone-number')
const example = require('./routes/example');
const phone_call_api = require('./controllers/phone_call_api');
const mongoose = require('mongoose');
app.use(cors());

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

app.use(documentation)
app.use(phone_verification)
app.use(example)

/**
 * phone call api route below
 *
 * A post request should  be made to localhost:5000/api/v1/call
 *
 */
app.use('/api', phone_call_api);

app.listen(5000, () => {
    console.log(`app running on port: http://localhost:5000`);
});

require('dotenv').config()
require('./routes/transactions.js')(app);
