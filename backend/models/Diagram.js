const mongoose = require("mongoose");

const diagramSchema = new mongoose.Schema({
  name: String,
  nodes: Array,   // 🔥 IMPORTANT CHANGE
  edges: Array,
});

module.exports = mongoose.model("Diagram", diagramSchema);