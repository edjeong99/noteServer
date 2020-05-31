This is a note taking app server.
It is a personal project to improve my back-end development skills.  There is a corresponding front-end app.

Front-end and Back-end each took 4 days to develop as part of Lambda School's curriculum. I then deployed both Front-end and Back-end.

Based on the school project, I am making several changes to improve.  Some of the main changes are
- using MongoDB
- deploying at AWS




### to test site

You can visit https://ed-notes.netlify.com to see the site. You can create an account or use this credential username : q, password : 1.

### Deployment

Front End : https://ed-notes.netlify.com
Back End : 

### Installation

To install the application in a local dev environment, run `yarn install` in the root folder as well as the client folder. Then, in the root folder you run `yarn server` and in the client folder you run `yarn start`.

### Tech Stack Rationale


#### Back End

**Solution:** Node, Express

- JavaScript on the front and back end
- Reduces server-side logic complexity -> faster development
- Minimalist and un-opinionated framework
- Performance and cross-platform coverage

#### Database

**Solution:** MongoDb

### Back-end API

##### GET https://https://ed-notes.herokuapp.com/allnotes/:id

Returns an array of all the notes of logged users.

##### GET https://ed-notes.herokuapp.com/api//notes/:id

Returns an note of the id.

##### POST https://https://ed-notes.herokuapp.com/api//addnote

Add a new note to DB

##### PUT https://https://ed-notes.herokuapp.com/notes/:id

Edit an existing note of the id. The content of edited note is send as req.body in a format of
{
title : "title",
textBody : "notes"
}

##### DELETE https://https://ed-notes.herokuapp.com/api/notes/:id

Delete a note of the id

##### GET https://https://ed-notes.herokuapp.com/api/search

Returns those notes that matches query

End