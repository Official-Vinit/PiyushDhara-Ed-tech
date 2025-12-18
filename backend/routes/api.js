// server/routes/api.js
const express = require('express');
const router = express.Router();

// Import our models
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Unit = require('../models/Unit');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = require('../middleware/auth');


// --- AUTH ROUTE ---
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check credentials against .env
  if (
    username === process.env.ADMIN_USERNAME && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // Success: Create a token
    const payload = { user: { id: 'admin' } };

    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '4h' }, // Token lasts for 4 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } else {
    res.status(400).json({ msg: 'Invalid Credentials' });
  }
});

// --- COURSE ROUTES ---

/**
 * @route   GET /api/courses
 * @desc    Get all courses (for the sidebar)
 */
router.get('/courses',  async (req, res) => {
  try {
    // Find all courses and populate their 'subjects' field
    // This replaces the Subject IDs with the actual Subject documents
    const courses = await Course.find().populate('subjects');
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: 'subjects', // First, populate the 'subjects' array
      populate: {
        path: 'units' // Then, inside each subject, populate its 'units' array
      }
    });

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);
    // This handles cases where the ID is not a valid format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.get('/units/:unitId', async (req, res) => {
  try {
    // We need to populate the 'subject' field to get the subject's name
    // And then populate the 'course' field inside the subject
    const unit = await Unit.findById(req.params.unitId).populate({
      path: 'subject',
      populate: {
        path: 'course'
      }
    });

    if (!unit) {
      return res.status(404).json({ msg: 'Unit not found' });
    }

    res.json(unit);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Unit not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 */
router.post('/courses', auth, async (req, res) => {

  try {
  const { name, description, teacher, teacherImage } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'Please provide a name for the course' });
    }

    // Create a new course instance
    const newCourse = new Course({
      name: name,
      teacher: teacher || 'Gaurav Sir',
      teacherImage: teacherImage || ''
      // subjects array is empty by default
    });

    // Save it to the database
    await newCourse.save();

    // Send the new course back as confirmation
    res.status(201).json(newCourse);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/courses/:courseId
 * @desc    Delete a course
 */
router.delete('/courses/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // TODO: In a real app, we'd also need to delete all
    // associated subjects and units, which is a bit complex.
    // For now, we'll just delete the course itself.

    await course.deleteOne();

    res.json({ msg: 'Course removed successfully' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// --- UPDATE COURSE ---
router.put('/courses/:id', auth, async (req, res) => {
  const { name,teacher, teacherImage } = req.body;

  try {
    // Find the course and update it with new data
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { name, teacher, teacherImage },
      { new: true } // This option tells Mongoose to return the *updated* version
    );

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// --- UPDATE SUBJECT ---
router.put('/subjects/:id', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json(updatedSubject);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// --- UPDATE UNIT ---
router.put('/units/:id', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json(updatedUnit);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// --- GET SINGLE SUBJECT (WITH UNITS) ---
router.get('/subjects/:id', async (req, res) => {
  try {
    // .populate('units') is the magic word that grabs the full unit details
    const subject = await Subject.findById(req.params.id).populate('units');
    res.json(subject);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});


/**
 * @route   POST /api/subjects
 * @desc    Create a new subject for a specific course
 */
router.post('/subjects', auth, async (req, res) => {
  // We need two things: the name, and the ID of the course it belongs to
  const { name, courseId } = req.body;

  if (!name || !courseId) {
    return res.status(400).json({ msg: 'Please provide a name and courseId' });
  }

  try {
    // First, check if the parent course actually exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Create the new subject
    const newSubject = new Subject({
      name: name,
      course: courseId
      // units array is empty by default
    });

    // Save the subject to the database
    await newSubject.save();

    // IMPORTANT: Add this new subject's ID to the parent course's 'subjects' array
    course.subjects.push(newSubject._id);
    await course.save();

    // Send the new subject back as confirmation
    res.status(201).json(newSubject);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/subjects/:subjectId
 * @desc    Delete a subject
 */
router.delete('/subjects/:subjectId', auth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);

    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    // IMPORTANT: We must also remove the subject's ID from its parent course
    await Course.findByIdAndUpdate(subject.course, {
      $pull: { subjects: subject._id } // $pull removes an item from an array
    });

    // TODO: In a real app, we'd also delete all associated units.

    // Now, delete the subject itself
    await subject.deleteOne();

    res.json({ msg: 'Subject removed successfully' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subject not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/units
 * @desc    Create a new unit for a specific subject
 */
router.post('/units', auth, async (req, res) => {
  // We need the unit's name and the ID of the subject it belongs to
  const { name, subjectId } = req.body;

  if (!name || !subjectId) {
    return res.status(400).json({ msg: 'Please provide a name and subjectId' });
  }

  try {
    // First, check if the parent subject actually exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    // Create the new unit
    const newUnit = new Unit({
      name: name,
      subject: subjectId
      // videos and notes arrays are empty by default
    });

    // Save the unit to the database
    await newUnit.save();

    // IMPORTANT: Add this new unit's ID to the parent subject's 'units' array
    subject.units.push(newUnit._id);
    await subject.save();

    // Send the new unit back as confirmation
    res.status(201).json(newUnit);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/units/:unitId
 * @desc    Delete a unit
 */
router.delete('/units/:unitId', auth, async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.unitId);

    if (!unit) {
      return res.status(404).json({ msg: 'Unit not found' });
    }

    // IMPORTANT: We must also remove the unit's ID from its parent subject
    await Subject.findByIdAndUpdate(unit.subject, {
      $pull: { units: unit._id } // $pull removes an item from an array
    });

    // Now, delete the unit itself
    await unit.deleteOne();

    res.json({ msg: 'Unit removed successfully' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Unit not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/units/:unitId/videos
 * @desc    Add a video to a unit
 */
router.put('/units/:unitId/videos', auth, async (req, res) => {
  // Get the video details from the request body
  const { title, youtubeId, duration } = req.body;

  if (!title || !youtubeId) {
    return res.status(400).json({ msg: 'Please provide a title and youtubeId' });
  }

  try {
    const unit = await Unit.findById(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ msg: 'Unit not found' });
    }

    const newVideo = { title, youtubeId, duration };

    // Add the new video to the 'videos' array
    unit.videos.push(newVideo);
    await unit.save();

    res.status(201).json(unit.videos); // Send back the updated videos array

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/units/:unitId/videos/:videoId
 * @desc    Delete a video from a unit
 */
router.delete('/units/:unitId/videos/:videoId', auth, async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ msg: 'Unit not found' });
    }

    // Find the video by its ID and remove it
    unit.videos.pull({ _id: req.params.videoId });

    await unit.save();
    res.json(unit.videos); // Send back the updated videos array

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/units/:unitId/notes
 * @desc    Add a note to a unit
 */
router.put('/units/:unitId/notes', auth, async (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ msg: 'Please provide a title and url' });
  }

  try {
    const unit = await Unit.findById(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ msg: 'Unit not found' });
    }

    const newNote = { title, url };

    unit.notes.push(newNote);
    await unit.save();

    res.status(201).json(unit.notes); // Send back the updated notes array

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/units/:unitId/notes/:noteId
 * @desc    Delete a note from a unit
 */
router.delete('/units/:unitId/notes/:noteId', auth, async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ msg: 'Unit not found' });
    }

    // Find the note by its ID and remove it
    unit.notes.pull({ _id: req.params.noteId });

    await unit.save();
    res.json(unit.notes); // Send back the updated notes array

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/seed', auth, async (req, res) => {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Subject.deleteMany({});
    await Unit.deleteMany({});

    // 1. Create a Course
    const course1 = new Course({ name: 'Civil Engineering' });

    // 2. Create Subjects
    const subject1 = new Subject({ name: 'Environment', course: course1._id });
    const subject2 = new Subject({ name: 'Hydraulics', course: course1._id });

    // 3. Create Units for Subject 1
    // And change it to this:
    const unit1 = new Unit({
      name: 'CH 01: Water Demand',
      subject: subject1._id,
      notes: [ // <-- NEW
        { title: 'Chapter 1: Complete Notes (PDF)', url: 'https://drive.google.com/file/d/1mfQq0Nq5YBPnNQhjJalkrJAfNeJmy1q3/view?usp=drive_link' },
        { title: 'Chapter 1: Extra Practice Questions', url: 'https://drive.google.com/file/d/1mfQq0Nq5YBPnNQhjJalkrJAfNeJmy1q3/view?usp=drive_link' }
      ],
      videos: [
        { title: 'Lec 01: Water Demand (Part 1)', youtubeId: 'dQw4w9WgXcQ', duration: '01:58:20' },
        { title: 'Lec 02: Water Demand (Part 2)', youtubeId: 'dQw4w9WgXcQ', duration: '01:57:17' }
      ]
    });
    const unit2 = new Unit({
      name: 'CH 02: Source of water',
      subject: subject1._id,
      notes: [ // <-- NEW
        { title: 'Chapter 1: Complete Notes (PDF)', url: 'https://drive.google.com/file/d/1mfQq0Nq5YBPnNQhjJalkrJAfNeJmy1q3/view?usp=drive_link' },
        { title: 'Chapter 1: Extra Practice Questions', url: 'https://drive.google.com/file/d/1mfQq0Nq5YBPnNQhjJalkrJAfNeJmy1q3/view?usp=drive_link' }
      ],
      videos: [],
    });

    // 4. Save everything
    await course1.save();
    await subject1.save();
    await subject2.save();
    await unit1.save();
    await unit2.save();

    // 5. Link them up
    course1.subjects.push(subject1._id, subject2._id);
    subject1.units.push(unit1._id, unit2._id);

    await course1.save();
    await subject1.save();

    res.status(201).json({ msg: 'Sample data seeded successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;