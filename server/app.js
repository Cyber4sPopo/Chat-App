const express = require('express');

const app = express();

app.use(express.json());

const messages = [];

app.get('/messages', (req, res) => {
    res.json(messages);
})

app.post('/messages', (req, res) => {
    messages.push(req.body);
    res.send('sent');
})

app.delete('/message/:id', (req, res) => {
    if (req.params.id < messages.length) {
        messages.splice(req.params.id, 1);
        res.json(messages);
    } else {
        res.send('message doesn\'t exist');
    }
})


module.exports = app;