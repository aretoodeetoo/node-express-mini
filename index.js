// implement your API here //
const express = require('express');

const db = require('./data/db.js');

const server = express();

// middleware
server.use(express.json());

// endpoints

// Initial endpoint to make sure code works
server.get('/', (req, res) => {
    res.send('<h2>Hello, I work!</h2>');
});

// Project Endpoints
// GET: returns array of all user objects in the db
server.get('/api/users', (req, res) => {
    db
        .find()
        .then(users => {
            res.status(200).json({ success: true, users });
        })
        .catch(err => {
            res.status(500).json({ success: false, message: 'The information about the users could not be retrieved' });
        });
});

// POST: creates user using info sent inside request body
server.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio){
        res.status(400).json({ success: false, message: 'You need to have both a name and bio to input a new user'});
    }
    db
        .insert(user)
        .then(user => {
            res.status(201).json({ success: true, user });
        })
        .catch(err => {
            res.status(500).json({ success: false, message: 'There was an error while saving the user to the database.'});
        });
});

// GET: returns user object with specified ID
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db
        .findById(id)
        .then(user => {
            if (!user){
                res.status(404).json({ message: 'The user with the specified ID does not exist'});
            }
            res.status(200).json({ success: true, user });
        })
        .catch(err => {
            res.status(500).json({ success: false, message: 'The user information could not be retrieved' });
        });
});

// DELETE: removes the user with specified id and returns the deleted user
server.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db
        .remove(userId)
        .then(deletedUser => {
            if (deletedUser === 0){
                res.status(404).json({ message: 'The user with the specified ID does not exist'})
            }
            res.status(204).end();
        })
        .catch(({ code, message }) => {
            res.status(code).json({ success: false, message });
        });
});

// PUT: Updates user with specified id using data from the request body
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db
        .update(id, changes)
        .then(updatedUser => {
            if (updatedUser){
                res.status(200).json({ success: true, updatedUser });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'This user does not exist',
                });
            }
        })
        .catch(({ code, message }) => {
            res.status(code).json({ success: false, message });
        });
});

server.listen(4000, () => {
    console.log('\n *** Running on port 4000 *** \n');
});