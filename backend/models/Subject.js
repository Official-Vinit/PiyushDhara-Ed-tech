// server/models/Subject.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 140,
  },
  // Link back to the parent course
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  // Link to its units
  units: [{
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subject', SubjectSchema);