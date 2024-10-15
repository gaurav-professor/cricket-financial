const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// Get all matches (populate players)
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().populate('players.player');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single match by ID (populate players)
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('players.player');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new match
router.post('/', async (req, res) => {
  const { groundName, groundLocation, googleMapLink, bookingFee, feePerPerson, dateTime } = req.body;

  const match = new Match({
    groundName,
    groundLocation,
    googleMapLink,
    bookingFee,
    feePerPerson,
    dateTime,
  });

  try {
    const savedMatch = await match.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a match
router.put('/:id', async (req, res) => {
  try {
    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(updatedMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update player payments in the match
router.put('/:id/players', async (req, res) => {
  const { players } = req.body;

  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    match.players = players.map(player => ({
      player: player.player,
      paidAmount: player.paidAmount,
    }));

    const updatedMatch = await match.save();

    // Populate the players after saving
    await updatedMatch.populate('players.player');

    res.json(updatedMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove a player from a match
router.delete('/:id/players/:playerId', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    match.players = match.players.filter(
      player => player.player.toString() !== req.params.playerId
    );

    const updatedMatch = await match.save();

    // Populate the players after saving
    await updatedMatch.populate('players.player');

    res.json(updatedMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a match
router.delete('/:id', async (req, res) => {
  try {
    const deletedMatch = await Match.findByIdAndRemove(req.params.id);
    if (!deletedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(deletedMatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;