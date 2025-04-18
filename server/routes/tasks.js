const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   GET api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, category, tags, priority, dueDate } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      category,
      tags: tags || [],
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      user: req.user.id
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, completed, category, tags, priority, dueDate } = req.body;

  // Build task object
  const taskFields = {};
  if (title !== undefined) taskFields.title = title;
  if (description !== undefined) taskFields.description = description;
  if (completed !== undefined) taskFields.completed = completed;
  if (category !== undefined) taskFields.category = category;
  if (tags !== undefined) taskFields.tags = tags;
  if (priority !== undefined) taskFields.priority = priority;
  if (dueDate !== undefined) taskFields.dueDate = dueDate;

  try {
    let task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // In newer Mongoose versions, remove() is deprecated, use deleteOne() instead
    await Task.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/category/:category
// @desc    Get tasks by category
// @access  Private
router.get('/category/:category', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      category: req.params.category
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/status/:status
// @desc    Get tasks by completion status
// @access  Private
router.get('/status/:status', auth, async (req, res) => {
  const completed = req.params.status === 'completed';

  try {
    const tasks = await Task.find({
      user: req.user.id,
      completed
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/search/:keyword
// @desc    Search tasks by title
// @access  Private
router.get('/search/:keyword', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      title: { $regex: req.params.keyword, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 