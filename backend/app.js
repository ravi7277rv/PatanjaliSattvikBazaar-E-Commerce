const express = require("express");
const app = express();
const CORS = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require('dotenv');


app.use(CORS());
const errorMiddleware = require('./middleware/error');

//config
dotenv.config({path:"backend/config/config.env"});


//BuiltIn Middleware
// app.use(express.json());
// app.use(express.urlencoded({extended:false,limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
// app.use(byodParser.urlencoded({extended: true}));
app.use(fileUpload());



//Middleware for Error
app.use(errorMiddleware);


//Route Import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const contactRoute = require("./routes/contactRoute")


//using route
app.use("/api/v1",product);
app.use("/api/v1",user)
app.use("/api/v1",order);
app.use("/api/v1",payment);
app.use("/api/v1",contactRoute);





module.exports = app;
