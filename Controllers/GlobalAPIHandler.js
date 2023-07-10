const express = require("express");
const Router = express.Router();
const Connection = require("../DBConnections/Mongo");

Router.get("/api/global/:hotelId",async(req,res) => {
    const result = await Connection.client
    .db("HMA")
    .collection("hotels-menu")
    .findOne({ "hotelId" : req.params.hotelId })
    
    if(result){
      res.send(result);
    }
    else{
      res.send("No records found for provided id")
    }
  })


module.exports = Router;