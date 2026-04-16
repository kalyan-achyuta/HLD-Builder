const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb+srv://kalyanachyuta_db_user:GbEoQBA983wg5YF8@cluster0.gwezlbq.mongodb.net/hldbuilder")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

const diagramSchema = new mongoose.Schema({
  name: String,
  nodes: Array,
  edges: Array,
});

const Diagram = mongoose.model("Diagram", diagramSchema);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.post("/save", async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;

    const newDiagram = new Diagram({ name, nodes, edges });
    await newDiagram.save();

    res.json({ message: "Saved successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
});

app.get("/diagrams", async (req, res) => {
  try {
    const data = await Diagram.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.put("/diagram/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nodes, edges } = req.body;

    await Diagram.findByIdAndUpdate(id, { name, nodes, edges });

    res.json({ message: "Updated successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete("/diagram/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Diagram.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully 🗑️" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});