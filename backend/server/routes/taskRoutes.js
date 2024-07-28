const express = require("express");
const {
  createTask,
  getTasksByUserId,
  updateTask,
  deleteTask,
} = require("../models/task");

const taskRoutes = (db) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { userId, title, description, dueDate, completed } = req.body;

    try {
      const newTask = await createTask(db, {
        userId,
        title,
        description,
        dueDate,
        completed,
      });
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.post("/bulk", async (req, res) => {
    const { tasks } = req.body;

    try {
      const insertedTasks = [];
      for (const task of tasks) {
        const newTask = await createTask(db, task);
        insertedTasks.push(newTask);
      }
      res.status(201).json(insertedTasks);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const tasks = await getTasksByUserId(db, userId);
      res.status(200).send(tasks);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.put("/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const updateFields = req.body;

    try {
      const updatedTask = await updateTask(db, taskId, updateFields);
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.delete("/:taskId", async (req, res) => {
    const { taskId } = req.params;

    try {
      await deleteTask(db, taskId);
      res.status(204).send();
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  return router;
};

module.exports = taskRoutes;
