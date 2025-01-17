const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');

const app = express();
app.use(express.json());

// Configure CORS to allow the specific URL
const corsOptions = {
  origin: 'http://localhost:3000',
};


// Use the CORS middleware with the specified options
app.use(cors(corsOptions));

// Connect to MongoDB Atlas
mongoose
  .connect("mongodb://127.0.0.1:27017/onlinedb?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Student Schema and Model
// const studentSchema = new mongoose.Schema({
//   name: String,
//   rollNo: String,
//   scores: {
//     Java: Number,
//     CPP: Number,
//     Python: Number,
//     GenAI: Number,
//     FSD: Number,
//   },
// });

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress','Completed'], default: 'Pending' },
    dueDate: { type: Date, required: true },
   });
   

// const Student = mongoose.model("Student", studentSchema);
const Task = mongoose.model("Task", taskSchema);

// Routes

// Insert a new student document
app.post("/api/tasks/", async (req, res) => {
  try {
    const task = new Task(req.body); // Expecting full student object in the request body
    console.log(task);
    await task.save();
    res.status(201).json({ message: "Task added successfully", task });
  } catch (err) {
    res.status(400).json({ message: "Failed to add student", error: err });
  }
});

// Update student data based on rollNo
app.put("/api/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedStudent = await Task.findOneAndUpdate(
      { _id:id },
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedStudent) {
      res.status(200).json({ message: "Student updated successfully", updatedStudent });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Failed to update student", error: err });
  }
});

// Delete a student document based on rollNo
app.delete("/api/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedStudents = await Task.deleteMany({ _id:id });
    if (deletedStudents.deletedCount > 0) {
      res.status(200).json({ 
        message: "Students deleted successfully", 
        deletedCount: deletedStudents.deletedCount 
      });
    } else {
      res.status(404).json({ message: "No students found with the given roll number" });
    }
  } catch (err) {
    res.status(400).json({ message: "Failed to delete students", error: err });
  }
});

// Retrieve student details by rollNo
app.get("/api/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Task.findOne({ _id:id });
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching student data", error: err });
  }
});

// Retrieve student details by rollNo
app.get("/api/tasks/", async (req, res) => {
  try {
    const students = await Task.find({}, { _id: 0 });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students", error });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});