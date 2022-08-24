const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const events = [];

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req,res) => {
    const event = req.body;
    console.log('Event emitted', event.type);

    events.push(event);
    //dispatch event to post
    await axios.post('http://posts-clusterip-service:4000/events', event);
    //dispatch event to comments
    await axios.post('http://comments-clusterip-service:4001/events', event);
    //dispatch event to query
    await axios.post('http://query-clusterip-service:4002/events', event);
    //dispatch event to moderation
    await axios.post('http://moderation-clusterip-service:4003/events', event);

    res.send({status: 'OK'});
});

app.get('/events', (req,res) => {
    res.status(200).send(events);
})

app.listen(4005, () => {
    console.log('Event bus running on 4005')
})