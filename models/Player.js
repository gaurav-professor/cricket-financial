const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, enum: ['Team A', 'Team B'], required: true },
  battingStyle: { type: String, required: false },  // New field
  bowlingStyle: { type: String, required: false },  // New field
});

module.exports = mongoose.model('Player', playerSchema);
