const passport = require('passport');
const express = require('express');
var LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const Connection = require('../DBConnections/Mongo');
const axios = require('axios');
const Router = express.Router();

passport.use(new LocalStrategy(function verify(username, password, done) {
    Connection.client.db("HMA").collection("users").findOne(
        { username: username },
        function (err, Nextuser) {
            if (err) {
                console.log(err);
                return;
            }
            if (!Nextuser) {
                return done(null, false, {
                    message: 'Username Incorrect!',
                });
            }
            let psk = bcrypt.compareSync(password, Nextuser.password);
            if (psk) {
                // console.log(Nextuser, 'user found');
                return done(null, Nextuser);
            }
            else {
                return done(null, false, {
                    message: 'Password Incorrect!',
                });
            }
        }
    );
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// Create a route for handling the login request
Router.post('/api/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/success',
    failureRedirect: '/failed'
}));

Router.get('/success', (req, res) => {
    res.send({
        message: 'Successfully Logged In',
        status: 202,
       auth: req.isAuthenticated()
    });
})
Router.get('/failed', (req, res) => {
    res.send({
        message: 'Log In Failed',
        status: 403,
       auth: req.isAuthenticated()
    });
})

Router.get('/api/auth', (req, res) => {
    res.send({
        message: (req.isAuthenticated()) ? 'Authenticated' : 'Not Authenticated',
        status: (req.isAuthenticated()) ? 202 : 403,
       auth: req.isAuthenticated()
    });
})

Router.get('/api/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.send({
            message: 'Logged Out Success',
            status: 202,
           auth: req.isAuthenticated()
        });
    });
})

Router.post('/api/signup', (req, res) => {
    Connection.client.db("HMA").collection("users").findOne({ username: req.body.username }, (err, rows) => {
        if (err) { return err; }
        if (!rows) {
            const payload = {
                username: req.body.username,
                password: req.body.password
            }
            const salt = bcrypt.genSaltSync(16);
            const hash = bcrypt.hashSync(payload.password, salt);
            payload.password = hash;

            Connection.client.db("HMA").collection("users").insertOne(payload, (err, success) => {
                if (err) {
                    return err;
                }
                else {
                        res.status(202).send({
                            message: 'Successfully Added user',
                            status: 202
                        })
                }
            })
        }
        else {
            res.status(409).send({
                message: 'username already exists',
                status: 409
            })
        }
    })
})

module.exports = Router;