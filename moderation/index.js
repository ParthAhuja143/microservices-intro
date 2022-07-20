const express = require('express');
const bosyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bosyParser.json());

app.post('/events', async (req,res) => {
    const {type, data} = req.body;

    if(type === 'CommentCreated'){
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
    
        await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
            id: data.id,
            postId: data.postId,
            status: status,
            content: data.content,
        }
    })
    }

    res.status(200).send({});
});

app.listen(4003, () => {
    console.log('Listening on port 4003');
});