import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Container,
  TextField,
  Typography,
  List,
  ListItemText,
  Paper,
  IconButton,
  ListItemSecondaryAction,
  ListItemButton,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const getWeekDays = (startDate) => {
  const days = [];
  const day = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  return days;
};

const formatDate = (date) => date.toISOString().split("T")[0];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [userInfo, setUserInfo] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`/api/tasks/${user.uid}`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`/api/users/${user.uid}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (user) {
      fetchTasks();
      fetchUserInfo();
    }
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/tasks", {
        ...newTask,
        userId: user.uid,
        completed: false,
      });
      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "", dueDate: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, {
        completed: !completed,
      });
      const updatedTask = response.data;
      setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const renderTasksForDate = (date) => {
    const formattedDate = formatDate(date);
    const tasksForDate = tasks.filter(
      (task) => task.dueDate && task.dueDate === formattedDate
    );

    return tasksForDate.length > 0 ? (
      tasksForDate.map((task) => (
        <ListItemButton
          key={task._id}
          onClick={() => handleToggleComplete(task._id, task.completed)}
        >
          <ListItemText
            primary={task.title}
            secondary={task.description}
            style={{
              textDecoration: task.completed ? "line-through" : "none",
            }}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task._id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemButton>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">
        No tasks
      </Typography>
    );
  };

  const weekDays = getWeekDays(startDate);

  const handlePreviousWeek = () => {
    setStartDate(new Date(startDate.setDate(startDate.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setStartDate(new Date(startDate.setDate(startDate.getDate() + 7)));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Taskcally Dashboard
              </Typography>
              <Button
                color="inherit"
                onClick={() => {
                  navigate("/signin");
                }}
                startIcon={<LogoutIcon />}
              >
                Sign Out
              </Button>
            </Toolbar>
          </AppBar>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AssignmentIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Hello, {userInfo.name || "User"}
          </Typography>
          <Box sx={{ mt: 3, width: "100%" }}>
            <Typography component="h2" variant="h6" gutterBottom>
              Your Tasks for the Week
            </Typography>
            <Button onClick={handlePreviousWeek}>Previous Week</Button>
            <Button onClick={handleNextWeek}>Next Week</Button>
            <Grid container spacing={2}>
              {weekDays.map((day) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={day.toDateString()}
                >
                  <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
                    <Typography variant="h6">{day.toDateString()}</Typography>
                    <List>{renderTasksForDate(day)}</List>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            component="form"
            onSubmit={handleAddTask}
            noValidate
            sx={{ mt: 3, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Task Title"
              name="title"
              autoComplete="title"
              value={newTask.title}
              onChange={handleInputChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Task Description"
              id="description"
              autoComplete="description"
              value={newTask.description}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="dueDate"
              label="Due Date"
              type="date"
              id="dueDate"
              InputLabelProps={{
                shrink: true,
              }}
              value={newTask.dueDate}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Task
            </Button>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => navigate("/ai-todo")}
          >
            Try Out the AI Todo Maker
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
