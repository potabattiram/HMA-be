const express = require("express");
const Router = express.Router();
const Connection = require("../../../DBConnections/Mongo");
const isAuthenticated = require('../Middlewares/isAuthenticated');

Router.post("/api/add-hotel", (req, res) => {
  const hotelId = req.body.hotelId;
  console.log(req.user);
  // Check if the username exists in the database
  Connection.client
    .db("HMA")
    .collection("HotelAdminUserData")
    .findOne({ hotelId }, (err, result) => {
      if (err) {
        // Handle database error
        return res.status(500).send({
          message: "FAILED",
          status: false,
          data: err,
        });
      }

      if (result) {
        // Username already exists, return a 409 Conflict status
        return res.status(409).send({
          message: "FAILED",
          status: false,
          data: "Hotel ID already exists",
        });
      }

      // Username does not exist, insert the new hotel
      const newHotel = {
        hotelId,
        hotelName: req.body.hotelName,
        city: req.body.city,
        tableCount: req.body.tableCount,
      };

      Connection.client
        .db("HMA")
        .collection("HotelAdminUserData")
        .insertOne(newHotel, (insertErr, success) => {
          if (insertErr) {
            // Handle insertion error
            return res.status(500).send({
              message: "FAILED",
              status: false,
              data: insertErr,
            });
          } else {
            return res.send({
              message: "SUCCESS",
              status: true,
              data: "Hotel added successfully",
            });
          }
        });
    });
});

Router.post("/api/add-menu/:hotelId", async (req, res) => {
  const payload = {
    hotelId: req.params.hotelId,
    menu: req.body,
  };
  const result = await Connection.client
    .db("HMA")
    .collection("HotelAdminUserData")
    .findOne({ hotelId: req.params.hotelId });

  if (result) {
    Connection.client
      .db("HMA")
      .collection("HotelAdminMenuData")
      .insertOne(payload, (err, success) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          res.send("success");
        }
      });
  } else {
    res.send("No hotel find for specified Id");
  }
});

module.exports = Router;
