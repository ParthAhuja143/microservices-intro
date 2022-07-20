const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {default: axios} = require('axios');

const app = express();

const posts = {};

const handleEvent =(type, data) => {
    if(type === 'PostCreated'){
        const {id, title} = data;

        posts[id] = {
            id: id,
            title: title,
            comments: []
        }
    }
    else if(type === 'CommentCreated'){
        const {id, content, postId, status} = data;

        const post = posts[postId];
        post.comments.push({id: id, content: content, status: status})
    }

    else if(type === 'CommentUpdated'){
        const {id , postId, content, status} = data;

        const post = posts[postId];

        const comment = post.comments.find(comment => (
            comment.id === id
        ))

        comment.status = status;
        comment.content = content;
    }

}

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req,res) => {
    res.status(200).send(posts);
});

app.post('/events', (req,res) => {
    const {type, data} = req.body;

    handleEvent(type, data);

    res.status(200).send({});
});

app.listen(4002, async () => {
    console.log('Listening on port 4002');

    const res = await axios.get('http://localhost:4005/events')

    for(let event of res.data){
        console.log('Processing event: ', event.type);

        handleEvent(event.type, event.data);
    }
});