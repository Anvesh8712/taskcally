import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const defaultTheme = createTheme();

const AITodo = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState({});
  const [dueDates, setDueDates] = useState({});

  const navigate = useNavigate();

  const handleGenerateTasks = async () => {
    if (prompt.trim() === "") {
      return;
    }

    try {
      const response = await axios.post("/api/gemini/generate-tasks", {
        prompt,
      });
      const generatedTasks =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      setTasks(generatedTasks);
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
      await axios.post("/api/tasks/bulk", {
        tasks: formattedTasks,
      });
      alert("Tasks saved successfully!");
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI task generator Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Typography component="h1" variant="h5">
          Type out the Project, you want to plan for!
        </Typography>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            label="Enter your task"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            sx={{ mt: 1, mb: 2 }}
          />
          <Button
            onClick={handleGenerateTasks}
            variant="contained"
            color="primary"
          >
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

          <Button onClick={handleSaveTasks} variant="contained" color="primary">
            Save Tasks
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="contained"
            color="primary"
            sx={{ mt: 1, mb: 2 }}
          >
            Head to Dashboard
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AITodo;
