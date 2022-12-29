import dotenv from 'dotenv';
import express from 'express';
// import connectDB from "./db/connect.js";

const app = express();


//middleware
app.use(express.json());
import productsRouter from "./routes/products.js";
import mongoose from "mongoose";


//routes
app.use("/api/v1/products", productsRouter);

dotenv.config();

const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to the DB...");
    })
    .then(() => {
        app.listen(port, console.log(`server is listening on port: ${port}`));
    })
    .catch((e) => console.log(e));
