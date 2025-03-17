import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import userRoute from "./routes/user.route.js"
import connectToMongoDB from "./db/connectToMongoDb.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

const __dirname= path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
app.use("/api/users", userRoute);
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/dist/index.html'));
});



server.listen(PORT, () =>{
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)
});

