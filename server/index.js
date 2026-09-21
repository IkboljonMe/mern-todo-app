require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require("path");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build/index.html"));
})


const router = require("./routes");
app.use("/api", router);

// Unknown API routes and errors return JSON instead of an HTML page
app.use("/api", (req, res) => {
    res.status(404).json({ mssg: "route not found" });
});
app.use((err, req, res, next) => {
    // body parser errors (bad JSON, body too large) have a 4xx status
    const status = err.status >= 400 && err.status < 500 ? err.status : 500;
    if (status === 500) console.error(err);
    const mssg = err.type === "entity.parse.failed" ? "invalid JSON" : status === 500 ? "server error" : err.message;
    res.status(status).json({ mssg });
});

const port = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectToMongoDB();
    } catch (error) {
        console.error("Could not connect to MongoDB:", error.message);
        process.exit(1);
    }
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
}
startServer();
