require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Diagram = require("./models/Diagram");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// 🔥 STRONG CONNECTION HANDLING
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("Mongo ERROR ❌:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("API running...");
});

// CREATE
app.post("/diagram", async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;

    const newDiagram = new Diagram({ name, nodes, edges });
    await newDiagram.save();

    res.json({ message: "Saved successfully ✅" });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ error: "Save failed" });
  }
});

// READ
app.get("/diagrams", async (req, res) => {
  try {
    const data = await Diagram.find();
    res.json(data);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// UPDATE
app.put("/diagram/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nodes, edges } = req.body;

    await Diagram.findByIdAndUpdate(id, { name, nodes, edges });

    res.json({ message: "Updated successfully ✅" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE
app.delete("/diagram/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Diagram.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully 🗑️" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});