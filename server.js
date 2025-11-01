import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cnnectDB from "./config/db.config.js";
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";

dotenv.config({
    path: "./.env"
});

const app = express();
const PORT = process.env.PORT;
const corsOptions = {
    origin: process.env.NODE_ENV === "development" ? process.env.DEV_ORIGIN : process.env.PRODUCTION_ORIGIN,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // preflightContinue: false,
    // optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); //dev -> combined

app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);

cnnectDB().then(() => {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
    app.listen(PORT, () => {
        console.log("Server is running...");
    });
}).catch((error) => {
    console.log("Failed to connect to the database", error);
}).finally(() => {
    console.log("Database connection attempt finished");
});
