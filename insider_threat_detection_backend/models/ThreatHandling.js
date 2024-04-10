const mongoose = require('mongoose');

const ThreatHandlingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    handledBy: {
        type: String,
        required: true,
      },
      comments: {
        type: String,
        required: false,
      },
      progress: {
        type: String,
        required: true,
        enum: ['open', 'in-progress', 'closed'], // Enum to restrict progress to specific values
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});