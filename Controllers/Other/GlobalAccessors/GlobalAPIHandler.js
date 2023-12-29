const express = require("express");
const Router = express.Router();
const Connection = require("../../../DBConnections/Mongo");

Router.get("/api/global/:hotelId", async (req, res) => {
  const result = await Connection.client
    .db("HMA")
    .collection("HotelAdminMenuData")
    .findOne({ hotelId: req.params.hotelId });

    if (result) {
    res.send(result);
  } else {
    res.send("No records found for provided id");
  }
});

Router.post("/api/place-order/:timestamp", (req,res) => {
  try{
    const payload = {
      profile: req.body.profile,
      data: req.body.data,
      createdAt: req.params.timestamp
    }
    Connection.client
    .db("HMA")
    .collection("OrderInformation")
    .insertOne(payload, (err, success) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.send("success");
      }
    })
  }
  catch(err){
    res.status(404).send(err)
  }
  
});

Router.get("/api/order-history/:hotelId", async (req, res) => {
  try {
    const result = await Connection.client
      .db("HMA")
      .collection("OrderInformation")
      .find({ "profile.hotelId": req.params.hotelId })
      .toArray();

    return res.status(202).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message || "Internal Server Error");
  }
});


// Additional


// Define the collections to truncate
// const collectionsToTruncate = [
//   'HotelAdminMenuData',
//   'HotelAdminUserData',
//   'LinkUser_Hotel',
//   'UserInformation',
//   'OrderInformation',
// ];

// // Truncate collections
// Router.get('/truncate-collections', async (req, res) => {
//   try {
//     const truncatePromises = collectionsToTruncate.map(collectionName =>
//       Connection.client.db("HMA").collection(collectionName).deleteMany({})
//     );

//     await Promise.all(truncatePromises);

//     res.status(200).json({ message: 'Collections truncated successfully.' });
//   } catch (error) {
//     console.error('Error truncating collections:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

module.exports = Router;
