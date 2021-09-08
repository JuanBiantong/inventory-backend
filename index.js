const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const cors = require("cors");


const productRouter = require("./routes/api/product");
const userRouter = require("./routes/api/user")

const app = express();

// for body-parser middleware
app.use(express.json());

//cors middleware
app.use(cors());

app.use("/uploads", express.static("uploads"));

const dbURI = process.env.DB_URI;
try {
    mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
} catch (error) {
    console.log(error);
}

//test database connection
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Database connected succefully...");
});

app.get("/", (req, res) => {
    res.end('Hello World')
})
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

if (process.env.NODE_ENV !== "production") require("dotenv").config();

if (process.env.NODE_ENV == "production") {
    // set static folder
    app.use(express.static(path.join(__dirname, "views", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "views", "build", "index.html"));
    });
}

// if the request passes all the middleware without a response
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// for general error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.response
    });
});

// App's connection port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
});