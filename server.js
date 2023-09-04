require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan')
const dbConnect = require('./config/db');
const router = require("./router");
const { mailServerCheck } = require("./config/nodemailer");


const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'))
app.use('/api', router)

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

dbConnect();
mailServerCheck();

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});


module.exports = app;


