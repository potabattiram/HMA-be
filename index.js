const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const MongoStore = require('connect-mongo');

const { client, connectToDatabase } = require('./DBConnections/Mongo'); // Adjust the path accordingly

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// Connect to the database first
connectToDatabase().then(() => {
  // Set up session store with MongoDB
  app.use(
    session({
      secret: "my-secret-key",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        client: client,
        dbName: 'HMA', // Replace with your actual database name
        ttl: 14 * 24 * 60 * 60, // Session TTL in seconds (optional)
      }),
      cookie: { secure: false, httpOnly: true, maxAge: 60 * 60 * 1000 },
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session());

  const AuthAPIs = require("./Controllers/Auth/Login");
  const HotelHandlers = require("./Controllers/Other/AdminHandlers/HotelHandlers");
  const GlobalAPIHandler = require("./Controllers/Other/GlobalAccessors/GlobalAPIHandler");
  const UserLinkstoBusiness = require("./Controllers/Other/AdminHandlers/PrePostLoginHandlers");

  app.get("/", (req, res) => {
    res.send("HMA is running good!");
  });

  app.use(AuthAPIs);
  app.use(HotelHandlers);
  app.use(GlobalAPIHandler);
  app.use(UserLinkstoBusiness);

  // Start the server after connecting to the database
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log("Listening on port", PORT);
  });
});

// Export the client for potential use elsewhere
module.exports = { client };
