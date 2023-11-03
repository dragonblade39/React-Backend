const express = require("express");
const router = express.Router();
const Data = require("../schema/Data");

router.post("/createTask", async (req, res, next) => {
  const { username, workoutType, selectedWorkoutType, date, fromTime, toTime } =
    req.body;

  try {
    const currentDate = new Date();
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // Convert to minutes

    if (new Date(date) < currentDate || fromTime < currentTime) {
      return res
        .status(400)
        .json("Invalid date and time. Please choose a future date and time.");
    }

    const existingTask = await Data.findOne({
      selectedWorkoutType: selectedWorkoutType,
      username: username,
    });
    const timeFrom = await Data.findOne({
      fromTime: fromTime,
      username: username,
    });

    if (existingTask && timeFrom) {
      if (
        existingTask.username === username &&
        timeFrom.username === username
      ) {
        return res
          .status(400)
          .json(
            "Tasks already exist for the same username. Delete to add again."
          );
      }
    }

    const newUser = await Data.create({
      username,
      workoutType,
      selectedWorkoutType,
      date,
      fromTime,
      toTime,
    });

    return res.json("Task added successfully");
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username parameter is missing" });
  }

  try {
    const filteredData = await Data.find({ username: username });

    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

module.exports = router;
