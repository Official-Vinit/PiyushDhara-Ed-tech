// server/models/Course.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: 1000,
  },
  // This creates a relationship. We'll store an array of Subject "ObjectIds"
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject' 
  }],
  teacher: {
    type: String,
    default: 'Gaurav Sir',
    trim: true,
    maxlength: 120,
  },
  teacherImage: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', CourseSchema);