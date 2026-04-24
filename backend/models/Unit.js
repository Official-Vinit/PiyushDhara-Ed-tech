// server/models/Unit.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// We can define the video schema right inside the unit
const VideoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 180,
  },
  youtubeId: {
    type: String,
    required: true,
    trim: true,
  },
  duration: { // Good to have, like in your screenshot
    type: String,
    trim: true,
  }
});

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 220,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  }
});

const UnitSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 180,
  },
  // Link back to the parent subject
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  notes: [NoteSchema],
  videos: [VideoSchema] // An array of videos
}, {
  timestamps: true,
});

module.exports = mongoose.model('Unit', UnitSchema);