const mongoose = require('mongoose');

// Define the schema
const predictionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },

  userId: {
    type: String,
    required: true
  },
  
  role: {
    type: String,
    required: true
  },

  user: {
    type: String, 
    require: true
  },

  prediction: {
    type: Number,
    required: true
  },

  assignedTo: {
    type: String,
    required: true,
    enum: ['Rohan', 'Kevin', 'Not Assigned'],
    default: 'Not Assigned'
  },

  progress: {
    type: String,
    required: true,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  }
});

// Compile model from schema
const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;
