const app = require("./app");
const connectDatabase = require("./config/database")
const dotenv = require('dotenv');
const cloudinary = require("cloudinary")
dotenv.config({path:"backend/config/config.env"});

//Handling Uncaught Exception
process.on("uncaughtException",(err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to the Uncaught Exception`);
    process.exit(1);
})

//connecting database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

cloudinary.config
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})


//Unhandled Promise 
process.on("unhandledRejection",(err) => {
    console.log(`Error :${err.message}`);
    console.log(`Shutting down the server due to the Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1)
    })
})