// controllers/adminController.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const Project = require('../models/Project');
const Message = require('../models/Message');

exports.getDashboard = async (req, res) => {
  try {
    const projects = await Project.countDocuments();
    const messages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      stats: {
        projects,
        messages,
        unreadMessages
      }
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading dashboard data');
    res.redirect('/admin/login');
  }
};

exports.getLogin = (req, res) => {
  res.render('admin/login', {
    title: 'Admin Login'
  });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/admin/login');
  });
};

exports.getProfile = (req, res) => {
  res.render('admin/profile', {
    title: 'Admin Profile',
    user: req.user
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    // Validate input
    const errors = [];
    
    if (currentPassword && newPassword) {
      // Validate current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        errors.push({ msg: 'Current password is incorrect' });
      }
      
      // Check new password confirmation
      if (newPassword !== confirmPassword) {
        errors.push({ msg: 'New passwords do not match' });
      }
      
      // Check password length
      if (newPassword.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
      }
    }
    
    // If there are errors, render the form again with errors
    if (errors.length > 0) {
      return res.render('admin/profile', {
        title: 'Admin Profile',
        user: req.user,
        errors
      });
    }
    
    // Update user
    user.name = name;
    user.email = email;
    
    // Update password if provided
    if (currentPassword && newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    
    await user.save();
    req.flash('success_msg', 'Profile updated successfully');
    res.redirect('/admin/profile');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating profile');
    res.redirect('/admin/profile');
  }
};

