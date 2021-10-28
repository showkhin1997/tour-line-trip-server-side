const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Torism Server Running');
});

app.listen(port, (req, res) => {
    console.log('listening Port', port);
});