// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Get all projects (public)
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get featured projects (public)
router.get('/projects/featured', async (req, res) => {
  try {
    const featuredProjects = await Project.find({ featured: true })
      .sort({ order: 1 })
      .limit(5);
    res.json(featuredProjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Create a new project (protected)
router.post('/projects', async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      imageUrl,
      projectUrl,
      githubUrl,
      featured,
      order
    } = req.body;

    // Create new project
    const newProject = new Project({
      title,
      description,
      technologies,
      imageUrl,
      projectUrl,
      githubUrl,
      featured,
      order
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error - Unable to create project' });
  }
});


// Get a specific project by ID
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});


// Update Project 
router.put('/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully', project: updatedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error - Unable to update project' });
  }
});


module.exports = router;

