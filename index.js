const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

const AuthAPIs = require('./AuthControllers/Login');
const HotelHandlers = require('./Controllers/HotelHandlers');


app.get('/', (req, res) => {
    res.send('HMA is running good!')
})

app.use(AuthAPIs);
app.use(HotelHandlers);

app.listen(3001, function () {
    console.log('Listening on port 3001')
})