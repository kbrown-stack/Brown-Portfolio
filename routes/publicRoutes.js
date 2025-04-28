// routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');


// Public routes
router.get('/', publicController.getHome);
router.get('/about', publicController.getAbout);
router.get('/projects', publicController.getProjects);
router.get('/projects/:id', publicController.getProjectDetail);
router.get('/contact', publicController.getContact);
router.post('/contact', publicController.submitContact);

module.exports = router;