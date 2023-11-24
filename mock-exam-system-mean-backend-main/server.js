const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/routes");

dotenv.config();
const server = express();

server.use(cors());
server.use(express.json({limit:"200mb"}));
server.use(express.urlencoded({extended:true,limit:"200mb"}));
server.use(routes);

// change PROD_DB_NAME to DEV_DB_NAME if in dev mode
// connection using mongodb atlas
// mongoose.connect(
//     `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.jebdmx5.mongodb.net/${process.env.PROD_DB_NAME}?retryWrites=true&w=majority`
// ).then(() => {
//     server.listen(process.env.PORT || 3000)
//     console.log("Success")
// }).catch((err) => {
//     console.log("Unable to connect to server: " + err)
// })

// change PROD_DB_NAME to DEV_DB_NAME if in dev mode
// local db connection'
mongoose.set('strictQuery', false);
mongoose
  .connect(`mongodb://0.0.0.0:27017/${process.env.DEV_DB_NAME}`)
  .then(() => {
    server.listen(process.env.PORT || 3000);
    console.log("Success");
  })
  .catch((err) => {
    console.log("Unable to connect to server: " + err);
  });
