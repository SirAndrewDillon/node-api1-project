//Requires the NPM Express module
const express = require('express')
//Creates an Express application using the express module
const server = express()
//Makes the database available to the server
const db = require('./data/db.js')
const cors = require('cors')

server.use(express.json())
server.use(cors())

// server sanity check
server.get('/', (req, res) => {
    res.send('<h1>Welcome to the Jungle</h1>')
})

// GET users end points
//Returns an array of all the user objects contained in the database.
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: 'This user wants nothing to do with you.',
      })
    })
})

//Returns the user object with the specified `id`.
server.get('/api/users/:id', (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'Get a grip there are only so many users.' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ errorMessage: 'That user is on a cruise in Alaska.' });
    });
});

//Creates a user using the information sent inside the `request body`
server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'There are only two catagories how hard is it to type the right ones?.' });
  } else {
    db.insert(req.body)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({
          errorMessage:
            'There was an error while saving the user to the database',
        });
      });
  }
});

//Removes the user with the specified `id` and returns the deleted user.
server.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      if (count && count > 0) {
        res.status(200).json({
          message: 'You just murdured the user.',
        });
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'That user is here to stay' });
    });
});


//Updates the user with the specified `id` using data from the `request body`. Returns the modified document
server.put('/api/users/:id', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Again there are only 2 categories, use them both!' });
  } else {
    db.update(req.params.id, req.body)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .json({
              message: 'That user died in a horrible plane crash.',
            });
        }
      })
      .catch(() => {
        res.status(500).json({
          errorMessage: 'That is the users name. You dont have permission to change it',
        });
      });
  }
});




//Once the server is fully configured you can have it listen for connections
//The callback function is passed as the second argument will run once the server starts
server.listen(1234, () => console.log("Chilling and having a cold one on port 1234"))
