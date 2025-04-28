const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String,
    required: true
  }],
  imageUrl: {
    type: String,
    default: 'default-project.jpg'
  },
  projectUrl: {
    type: String
  },
  // demoLink: {
  //   type: String
  // },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default:0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);