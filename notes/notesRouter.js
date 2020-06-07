const router = require('express').Router();
const { init, notesControllers } = require('./notesController.js');

init();
// ENDPOINT for each features

// return all notes
router.get('/allnotes', notesControllers.getNotes);

// return a note with matching id
router.get('/notes/:id', notesControllers.getANote);

// add a new note
router.post('/addnote', notesControllers.createNote);

// edit a note
router.put('/notes/:id', notesControllers.editNote);

// delete a note with the matching id
router.delete('/notes/:id', notesControllers.deleteNote);

// return notes with the matching query
router.get('/search', notesControllers.searchNote);

module.exports = router;
