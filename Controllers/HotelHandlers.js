const express = require("express");
const Router = express.Router();
const Connection = require("../DBConnections/Mongo");

Router.post("/api/add-hotel", (req, res) => {
  const hotelId = req.body.hotelId; // Assuming username is provided in the request body

  // Check if the username exists in the database
  Connection.client
    .db("HMA")
    .collection("hotelsData")
    .findOne({ hotelId }, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (result) {
        // Username already exists, return a 409 Conflict status
        return res.status(409).send("Username already exists");
      } else {
        // Username does not exist, insert the new hotel
        const hotel = {
          hotelId: req.body.hotelId,
          hotelName: req.body.hotelName,
          city: req.body.city,
          tableCount: req.body.tableCount,
        };

        Connection.client
          .db("HMA")
          .collection("hotelsData")
          .insertOne(hotel, (err, success) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              res.send("success");
            }
          });
      }
    });
});

Router.post("/api/add-menu/:hotelId", async(req, res) => {
  const payload = {
    hotelId: req.params.hotelId,
    menu: req.body
  }
  const result = await Connection.client
  .db("HMA")
  .collection("hotelsData")
  .findOne({ "hotelId" : req.params.hotelId })

  if(result){
    Connection.client
    .db("HMA")
    .collection("hotels-menu")
    .insertOne(payload, (err, success) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.send("success");
      }
    })
  }else{
    res.send("No hotel find for specified Id")
  }
 

});



module.exports = Router;
