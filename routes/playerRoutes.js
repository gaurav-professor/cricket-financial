const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new player
router.post('/', async (req, res) => {
  const { name, team, battingStyle, bowlingStyle } = req.body;  // Include new fields

  const player = new Player({ name, team, battingStyle, bowlingStyle });
  try {
    const savedPlayer = await player.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a player
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndRemove(req.params.id);
    if (!deletedPlayer) return res.status(404).json({ message: 'Player not found' });
    res.json(deletedPlayer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a player
router.put('/:id', async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        team: req.body.team,
        battingStyle: req.body.battingStyle,  // Include new fields
        bowlingStyle: req.body.bowlingStyle,  // Include new fields
      },
      { new: true }
    );
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
