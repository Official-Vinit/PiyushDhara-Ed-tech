// server/models/Unit.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// We can define the video schema right inside the unit
const VideoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  youtubeId: {
    type: String,
    required: true
  },
  duration: { // Good to have, like in your screenshot
    type: String 
  }
});

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const UnitSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  // Link back to the parent subject
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  notes: [NoteSchema],
  videos: [VideoSchema] // An array of videos
});

module.exports = mongoose.model('Unit', UnitSchema);