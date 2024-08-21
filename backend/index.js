const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express(); // Initialize the app before using it
app.use(cors());
app.use(express.json());


const rootRouter = require("./routes/index");


app.use("/api/v1", rootRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


module.exports = app;
