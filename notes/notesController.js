const db = require('../data/config.js');

// for using in pagination...
const limitNum = 3;

const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://edjeong99:klousman3@cluster0-uamnw.mongodb.net/Notes?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });

// client.connect((err) => {
//   const collection = client.db('Notes').collection('notes');
//   // perform actions on the collection object
//   client.close();
// });

const notesControllers = {
  // getNotes return all notes in the DB

  async getNotes(req, res, next) {
    console.log('begin getNotes');
    try {
      await client.connect();

      const collection = client.db('Notes').collection('notes');
      // perform actions on the collection object
      const result = await collection.find({}).toArray();
      console.log('getNotes in controller SUCCESS');

      res.status(200).send(result);
    } catch (e) {
      console.error(e);
      next(new Error('Could not get Notes'));
    } finally {
      console.log('getNotes at Finally');
      await client.close();
    }
  },

  // getANote return a note that matches the id in req.params.id
  async getANote(req, res, next) {
    console.log('get A Note');
    try {
      var noteID = req.params.id;
      noteID = parseInt(noteID); // change type of noteID from string to int
      // console.log('get A Note id = ', noteID);
      await client.connect();

      const selectedNote = await client
        .db('Notes')
        .collection('notes')
        .findOne({ id: noteID });
      console.log('get A Note selectedNote ', selectedNote);
      selectedNote
        ? res.status(200).json(selectedNote)
        : res
            .status(404)
            .json({ errorMessage: 'A note with that ID could not be found.' });
    } catch (err) {
      next(new Error('Could not get Notes'));
    } finally {
      console.log('getANote at Finally');
      await client.close();
    }
  },

  createNote(req, res, next) {
    const newNote = req.body;

    console.log('Create Note  req.body = ', req.body);

    db('notes')
      .insert(newNote)
      .then((id) => {
        if (!id) {
          next();
        }
        res.status(200).json(id);
      })
      .catch(() => next(new Error('Could not create a new Notes')));
  },

  async editNote(req, res, next) {
    try {
      const { id } = req.params;
      const editedNote = req.body;
      console.log('editedNote', editedNote);
      //    id = Number(id);
      // console.log( "why not this?", typeof id);

      const editedID = await db('notes')
        .where('notes.id', id)
        .update(editedNote);
      console.log('editedID', editedID);
      editedID
        ? res.status(200).json(editedID)
        : res
            .status(404)
            .json({ errorMessage: 'A note with that ID could not be found.' });
    } catch (err) {
      next(new Error('Could not edit Notes'));
    }
  },

  async deleteNote(req, res, next) {
    try {
      const { id } = req.params;

      const deleted = await db('notes').where('notes.id', id).delete();

      deleted
        ? res.status(200).json(deleted)
        : res
            .status(404)
            .json({ errorMessage: 'A note with that ID could not be found.' });
    } catch (err) {
      next(new Error('Could not delete Notes'));
    }
  },

  async searchNote(req, res, next) {
    //   const query = req.query.query;

    //   db('notes').where("notes.title", 'like', `%${query}%`)
    //     .orWhere("notes.textBody",'like', `%${query}%`)
    //   .then(notes => {
    //     if (!notes.length) {
    //       console.log("notes.length = ", notes.length);
    //       next();
    //     }
    //     res.status(200).json(notes);
    //   })
    //   .catch(() => next(new Error("Could not get Notes")));
    // },

    try {
      const query = req.query.query;

      const queryNotes = await db('notes')
        .where('notes.title', 'like', `%${query}%`)
        .orWhere('notes.textBody', 'like', `%${query}%`);
      console.log('in searchNote func  queryNotes = ', queryNotes);

      // queryNotes ?
      res.status(200).json(queryNotes);
      // : res
      //     .status(404)
      //     .json({ errorMessage: "No matching note founded" });
    } catch (err) {
      next(new Error('Could not search Notes'));
    }
  },
};
module.exports = notesControllers;
