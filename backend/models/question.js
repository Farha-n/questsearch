const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["MCQ", "MCM"], // MCQ for single-correct, MCM for multiple-correct
    required: true,
  },
  title: {
    type: String,
    required: true, // Question text
  },
  blocks: {
    type: Array, // Additional content blocks, optional
    default: [],
  },
  options: [
    {
      text: {
        type: String,
        required: true, // Option text
      },
      isCorrectAnswer: { type: Boolean, required: true }, // This is the field name in MongoDB

    },
  ],
  solution: {
    type: String, // Detailed explanation for the solution
    default: "",
  },
});

module.exports = mongoose.model("Question", questionSchema);