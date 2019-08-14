const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');

mongoose.connect(
  'mongodb+srv://omnistack:omnistack@cluster0-zjhfu.mongodb.net/test?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  },
);
app.use(cors());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(routes);

server.listen(3333);
