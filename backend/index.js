const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./server/routes/userRoutes");
const taskRoutes = require("./server/routes/taskRoutes");
const geminiRoutes = require("./server/routes/geminiRoutes");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// const uri = process.env.MONGODB_URI;
const uri =
  "mongodb+srv://atvanvesh:Shilpa123456+@taskcally.3uioyib.mongodb.net/?retryWrites=true&w=majority&appName=taskcally";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true, // Explicitly enable TLS/SSL
  tlsAllowInvalidCertificates: true, // Allow invalid certificates if necessary (use with caution)
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client
  .connect()
  .then(() => {
    return client.db("admin").command({ ping: 1 });
  })
  .then(() => {
    console.log("Connected to MongoDB");

    const db = client.db("taskcally");

    app.use("/api/users", userRoutes(db));
    app.use("/api/tasks", taskRoutes(db));
    app.use("/api/gemini", geminiRoutes(db));

    app.use("/", (req, res) => {
      res.json({ message: "Hello from server!" });
    });

    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  });

module.exports = app;
