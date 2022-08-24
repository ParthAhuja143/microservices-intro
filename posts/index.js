const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/posts/create', async (req,res) => {
    const id = randomBytes(4).toString('hex');

    const {title }= req.body;
    
    posts[id] = {
        id: id,
        title: title,
    };

    //sending event to event bus
    await axios.post('http://event-bus-clusterip-service:4005/events', {
        type: 'PostCreated',
        data: {
            id: id,
            title: title,
        }
    })

    res.status(200).send(posts[id]);
});

//recieving event
app.post('/events' , (req,res) => {
    const {type, data} = req.body;
    console.log('Event Received ',type);
    
    res.status(200).send({});
})

app.listen(4000, () => {
    console.log('Listening on port 4000');
})