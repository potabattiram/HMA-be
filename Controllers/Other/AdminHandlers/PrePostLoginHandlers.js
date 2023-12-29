const express = require("express");
const Router = express.Router();
const Connection = require("../../../DBConnections/Mongo");
const isAuthenticated = require('../Middlewares/isAuthenticated');

// Pre Login Handler
Router.post('/api/link-user-hotel', (req,res) =>{
    const payload = {
        username: req.body.username,
        hotelId:req.body.hotelId
    }
    Connection.client
    .db("HMA")
    .collection("LinkUser_Hotel")
    .insertOne(payload, (err, success) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.send("success");
      }
    });
    
})

Router.get('/api/get-linked-businesses/:username',(req, res) => {
  Connection.client
    .db("HMA")
    .collection("LinkUser_Hotel")
    .find({ username: req.params.username })
    .toArray((err, results) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.send(results || []);
      }
    });
});



module.exports = Router;
