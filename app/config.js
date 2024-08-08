const mongoose = require('mongoose');

// Connect to MongoDB
const connect = mongoose.connect("mongodb+srv://tanjimahammad31:frgxjlnpV9mpnbiD@login.s1uieyr.mongodb.net/Feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check database connected or not
connect
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Create Schema
const FeedbackSchema = new mongoose.Schema({
  messageID: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    enum: ['thumbsUp', 'thumbsDown'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create Model
const Feedback =mongoose.model.Feedback|| mongoose.model("Feedback", FeedbackSchema);

module.exports = Feedback;
