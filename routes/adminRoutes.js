// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const projectController = require('../controllers/projectController');
const messageController = require('../controllers/messageController');

// Authentication routes
router.get('/login', forwardAuthenticated, adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Dashboard route
router.get('/dashboard', ensureAuthenticated, adminController.getDashboard);

// Profile routes
router.get('/profile', ensureAuthenticated, adminController.getProfile);
router.post('/profile', ensureAuthenticated, adminController.updateProfile);

// Project routes
router.get('/projects', ensureAuthenticated, projectController.getAllProjects);
router.get('/projects/create', ensureAuthenticated, projectController.getCreateProject);
router.post('/projects/create', ensureAuthenticated, projectController.createProject);
router.get('/projects/edit/:id', ensureAuthenticated, projectController.getEditProject);
router.put('/projects/edit/:id', ensureAuthenticated, projectController.updateProject);
router.delete('/projects/delete/:id', ensureAuthenticated, projectController.deleteProject);

module.exports = router;