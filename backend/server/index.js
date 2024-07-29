const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// const uri = process.env.MONGODB_URI;
const uri =
  "mongodb+srv://atvanvesh:Shilpa123456+@taskcally.3uioyib.mongodb.net/?retryWrites=true&w=majority&appName=taskcally";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB");

    const db = client.db("taskcally");

    app.use("/api/users", userRoutes(db));
    app.use("/api/tasks", taskRoutes(db));
    app.use("/api/gemini", geminiRoutes(db));

    app.get("/api", (req, res) => {
      res.json({ message: "Hello from server!" });
    });

    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);
