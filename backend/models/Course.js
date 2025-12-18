// server/models/Course.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  // This creates a relationship. We'll store an array of Subject "ObjectIds"
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject' 
  }],
  teacher: {
    type: String,
    default: 'Gaurav Sir'  // Default fallback
  },
  teacherImage: {
    type: String,
    default: '' 
  },
});

module.exports = mongoose.model('Course', CourseSchema);