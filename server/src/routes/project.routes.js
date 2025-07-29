const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createProject, getProjects,  generateComponent } = require('../controllers/project.controller');

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);
  
router.post('/generate', protect, generateComponent);

module.exports = router;