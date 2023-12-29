const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true , maxAge: 60 * 60 * 1000 },
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

app.listen(3001, function () {
  console.log("Listening on port 3001");
});
