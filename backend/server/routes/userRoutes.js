const express = require("express");
const { createUser, getUserByUID } = require("../models/user");

const userRoutes = (db) => {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    const { uid, email, name } = req.body;

    try {
      const newUser = await createUser(db, { uid, email, name });
      res.status(201).send(newUser);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.post("/login", async (req, res) => {
    const { uid } = req.body;

    try {
      const user = await getUserByUID(db, uid);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.get("/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
      const user = await getUserByUID(db, uid);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  return router;
};

module.exports = userRoutes;
