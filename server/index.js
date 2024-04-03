const express = require('express');
const cors = require('cors');
const connect_db = require('./connect_DB/connect_db');
const dotenv = require('dotenv').config();
const morgan = require('morgan');

const app = express();

app.use(cors());

app.use(morgan("dev"));


app.use(express.json());


app.use("/user", require("./Routes/UserRoutes"));



app.listen(process.env.PORT, async () => {
    await connect_db();

    //console.log("server is up");
});