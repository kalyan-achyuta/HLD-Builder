const mongoose = require("mongoose");

const diagramSchema = new mongoose.Schema({
  nodes: [
    {
      id: String,
      type: String,
      position: {
        x: Number,
        y: Number,
      },
      data: {
        label: String,
      },
    },
  ],
  edges: [
    {
      id: String,
      source: String,
      target: String,
    },
  ],
});

module.exports = mongoose.model("Diagram", diagramSchema);