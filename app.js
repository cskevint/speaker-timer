const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const app = express();
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ timestamp: 0 }).write();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'client')));

app.get('/timestamp', (req, res) => {
    const timestamp = db.get('timestamp').value();
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({timestamp:timestamp}));
    res.end();
});

app.get('/reset', (req, res) => {
    db.update('timestamp', n => n + 1).write();
    const timestamp = db.get('timestamp').value();
    res.write(`RESET: ${timestamp}`);
    res.end();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});

const port = process.env.PORT || '4000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost: ${port}`));