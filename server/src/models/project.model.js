const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Untitled Project',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  chatHistory: [messageSchema],
  latestCode: {
    tsx: { type: String, default: '' },
    css: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;