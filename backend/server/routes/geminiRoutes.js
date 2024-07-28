const express = require("express");
const { generateTasks } = require("../geminiApi");

const geminiRoutes = (db) => {
  const router = express.Router();

  router.post("/generate-tasks", async (req, res) => {
    const { prompt } = req.body;

    console.log(`Received prompt: ${prompt}`);

    try {
      const tasksText = await generateTasks(prompt);
      console.log(`Generated tasks text: ${tasksText}`);
      //   const tasks = parseTasks(tasksText);
      res.status(200).json(tasksText);
    } catch (error) {
      console.error("Error generating tasks:", error);
      res.status(500).send("Error generating tasks");
    }
  });

  return router;
};

// // Helper function to parse the text into task objects
// const parseTasks = (text) => {
//   // Implement your parsing logic here
//   // Example:
//   const lines = text.split("\n");
//   return lines.map((line) => ({
//     title: line,
//     description: "",
//     dueDate: "",
//     completed: false,
//   }));
//   // Replace with your own parsing logic
// };

module.exports = geminiRoutes;
