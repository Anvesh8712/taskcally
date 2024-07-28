import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../AuthContext";

const AITodo = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState({});
  const [dueDates, setDueDates] = useState({});

  const handleGenerateTasks = async () => {
    if (prompt.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/gemini/generate-tasks",
        { prompt }
      );
      const generatedTasks =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      setTasks(generatedTasks);
      //   console.log(response.data);
      //   Object.keys(generatedTasks).map((key) =>
      //     console.log(key, generatedTasks[key])
      //   );
      setDueDates(generateDueDates(generatedTasks));
    } catch (error) {
      console.error("Error generating tasks:", error);
    }
  };

  const generateDueDates = (tasks) => {
    const dates = {};
    const today = new Date();
    let currentDate = new Date(today);
    Object.keys(tasks).forEach((key, index) => {
      currentDate.setDate(today.getDate() + index);
      dates[key] = currentDate.toISOString().split("T")[0];
    });
    return dates;
  };

  const handleDeleteTask = (key) => {
    const newTasks = { ...tasks };
    const newDueDates = { ...dueDates };
    delete newTasks[key];
    delete newDueDates[key];
    setTasks(newTasks);
    setDueDates(newDueDates);
  };

  const handleDueDateChange = (key, newDate) => {
    setDueDates({ ...dueDates, [key]: newDate });
  };

  const handleSaveTasks = async () => {
    try {
      const userId = user.uid; // Replace with actual user ID from auth context
      const formattedTasks = Object.keys(tasks).map((key) => ({
        userId,
        title: tasks[key],
        description: tasks[key],
        dueDate: dueDates[key],
        completed: false,
      }));
      await axios.post("http://localhost:3001/api/tasks/bulk", {
        tasks: formattedTasks,
      });
      alert("Tasks saved successfully!");
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  return (
    <div>
      <TextField
        label="Enter your task"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        fullWidth
      />
      <Button onClick={handleGenerateTasks} variant="contained" color="primary">
        Generate Tasks
      </Button>

      <List>
        {Object.keys(tasks).map((key) => (
          <ListItem key={key}>
            <ListItemText primary={tasks[key]} />
            <TextField
              label="Due Date"
              type="date"
              value={dueDates[key]}
              onChange={(e) => handleDueDateChange(key, e.target.value)}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteTask(key)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Button onClick={handleSaveTasks} variant="contained" color="secondary">
        Save Tasks
      </Button>
    </div>
  );
};

export default AITodo;
