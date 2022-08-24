const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const {default: axios} = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentByPostId = {};

app.get('/posts/:id/comments', (req,res) => {
    res.status(200).send(commentByPostId[req.params.id]);
});

app.post('/posts/:id/comments', async (req,res) => {
    const commentId = randomBytes(4).toString('hex');
    
    const {content} = req.body;

    const comments = commentByPostId[req.params.id] || [];

    comments.push({ id: commentId, content: content, status: 'pending'});

    commentByPostId[req.params.id] = comments;

    //sending event
    await axios.post('http://event-bus-clusterip-service:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content: content,
            postId: req.params.id,
            status: 'pending',
        }
    })

    res.status(200).send(commentByPostId[req.params.id]);

});

// receiving events
app.post('/events', async (req,res) => {
    
    const {type, data} = req.body;
    console.log('Event Received ',type);

    if(type === 'CommentModerated'){
        const { postId, id, status, content } = data;

        const comments = commentByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id = id;
        })

        comment.status = status;

        await axios.post('http://event-bus-clusterip-service:4005/events', {
            type: 'CommentUpdated',
            data: {
                id: id,
                postId: postId,
                content: content,
                status: status,
            }
        })
    }

    res.status(200).send({});
})

app.listen(4001, () => {
    console.log("Server running on port 4001");
});