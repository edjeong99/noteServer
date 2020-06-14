require('dotenv').config();

const dbUri = process.env.DBURI;
console.log('dbUri = ', dbUri);
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(dbUri, { useNewUrlParser: true });

let collection;

const init = function () {
  console.log('init in Controller.js');
  MongoClient.connect(dbUri, { useNewUrlParser: true }).then((client) => {
    collection = client.db('Notes').collection('notes');
  });
};

const notesControllers = {
  // getNotes return all notes in the DB
  async getNotes(req, res, next) {
    console.log('begin getNotes');
    try {
      const result = await collection.find({}).toArray();
      console.log('getNotes in controller SUCCESS');
      res.status(200).send(result);
    } catch (e) {
      console.error(e);
      next(new Error('Could not get Notes'));
    } finally {
      console.log('getNotes at Finally');
    }
  },

  // getANote return a note that matches the id in req.params.id
  async getANote(req, res, next) {
    console.log('get A Note');
    try {
      var noteID = req.params.id;
      noteID = parseInt(noteID); // change type of noteID from string to int
      console.log('get A Note id = ', noteID);

      const selectedNote = await collection.findOne({ id: noteID });
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
    }
  },

  async createNote(req, res, next) {
    const newNote = req.body;

    console.log('Create Note  req.body = ', req.body);
    try {
      const result = await collection.insertOne(newNote);
      console.log('createNotes in controller SUCCESS  result = ', result);
      res.status(200).send(result);
    } catch (e) {
      console.error(e);
      next(new Error('Could not add a Notes'));
    } finally {
      console.log('createNotes at Finally');
    }
  },

  async editNote(req, res, next) {
    try {
      var { id } = req.params;
      id = parseInt(id);
      const editedNote = req.body;
      console.log('editedNote', editedNote, 'id = ', id);
      const editedID = await collection.findOneAndUpdate(
        { id: id },
        { $set: editedNote },
        { returnNewDocument: true }
      );
      console.log('editedID = ', editedID);
      editedID.value
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
      var { id } = req.params;
      id = parseInt(id);

      const deleted = await collection.findOneAndDelete({ id: id });
      console.log('deleted - ', deleted);

      deleted.value
        ? res.status(200).json(deleted)
        : res
            .status(404)
            .json({ errorMessage: 'A note with that ID could not be found.' });
    } catch (err) {
      next(new Error('Could not delete Notes'));
    }
  },

  async searchNote(req, res, next) {
    try {
      var query = req.query.query;
      console.log('query = ', query);

      // $text look query in fields that createIndex in init()
      // created index - in our app, title and textBody field is indexed
      const queryNotes = await collection
        .find({ $text: { $search: query, $caseSensitive: false } })
        .toArray();

      console.log('queryNotes =', queryNotes);

      queryNotes.length
        ? res.status(200).json(queryNotes)
        : res.status(404).json({ errorMessage: 'No matching note founded' });
    } catch (err) {
      next(new Error('Could not search Notes'));
    }
  },
};
module.exports = { init, notesControllers };
