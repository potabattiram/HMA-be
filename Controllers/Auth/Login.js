const passport = require('passport');
const express = require('express');
var LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const Connection = require('../../DBConnections/Mongo');
const axios = require('axios');
const Router = express.Router();
const ObjectId = require('mongodb').ObjectId;

passport.use(new LocalStrategy(async function verify(username, password, done) {
    try {
        const Nextuser = await Connection.client.db("HMA").collection("UserInformation").findOne({ username: username });

        if (!Nextuser) {
            return done(null, false, {
                message: 'Username Incorrect!',
            });
        }

        const psk = bcrypt.compareSync(password, Nextuser.password);

        if (psk) {
            return done(null, Nextuser);
        } else {
            return done(null, false, {
                message: 'Password Incorrect!',
            });
        }
    } catch (err) {
        console.error(err);
        return done(err);
    }
}));


passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        // const objectIdInstance = new ObjectId(user._id);  objectIdInstance.toString()
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
    if(req.isAuthenticated()){
        res.send({
            user: req.user.id,
            message: 'Authenticated',
            status: 202,
           auth: req.isAuthenticated()
        });
    }
    else{
        res.send({
            message: 'Not Authenticated',
            status: 403,
           auth: req.isAuthenticated()
        });
    }
})

Router.get('/api/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).send({
                message: 'Error during logout',
                status: false,
                auth: req.isAuthenticated()
            });
        }

        // Destroy the session (clear the cookie)
        req.session.destroy((destroyErr) => {
            if (destroyErr) {
                return res.status(500).send({
                    message: 'Error during logout',
                    status: false,
                    auth: req.isAuthenticated()
                });
            }

            // Send a response indicating successful logout
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.send({
                message: 'Logged Out Successfully',
                status: 202,
                auth: req.isAuthenticated()
            });
        });
    });
});


Router.post('/api/signup', (req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(200).send({
            message:'FAILED',
            status: false,
            error: 'Please provide required fields, i.e. username and password'
        })
    }
    Connection.client.db("HMA").collection("UserInformation").findOne({ username: req.body.username }, (err, rows) => {
        if (err) { return err; }
        if (!rows) {
            const payload = {
                username: req.body.username,
                password: req.body.password
            }
            const salt = bcrypt.genSaltSync(16);
            const hash = bcrypt.hashSync(payload.password, salt);
            payload.password = hash;

            Connection.client.db("HMA").collection("UserInformation").insertOne(payload, (err, success) => {
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