
// controllers/publicController.js
const Project = require('../models/Project');
const Message = require('../models/Message');

exports.getHome = async (req, res) => {
  try {
    const featuredProjects = await Project.find({ featured: true })
      .sort({ order: 1 })
      .limit(3);
    
    res.render('public/index', {
      title: 'Welcome to My Portfolio',
      projects: featuredProjects,
      path: req.path
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error',
      error: 'Failed to load homepage'
    });
  }
};

exports.getAbout = (req, res) => {
  res.render('public/about', {
    title: 'About Me',
    path: req.path
  });
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    
    res.render('public/projects', {
      title: 'My Projects',
      projects,
      path: req.path
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error',
      error: 'Failed to load projects'
    });
  }
};

exports.getProjectDetail = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).render('error', {
        title: 'Not Found',
        error: 'Project not found'
      });
    }
    
    res.render('public/project-detail', {
      title: project.title,
      project,
      path: req.path
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error',
      error: 'Failed to load project details'
    });
  }
};

exports.getContact = (req, res) => {
  res.render('public/contact', {
    title: 'Contact Me',
    path: req.path
  });
};

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/contact');
    }
    
    // Create new message
    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });
    
    await newMessage.save();
    req.flash('success_msg', 'Your message has been sent. Thank you!');
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error sending message. Please try again.');
    res.redirect('/contact');
  }
};