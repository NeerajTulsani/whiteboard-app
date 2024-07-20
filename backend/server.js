const express = require('express');
const http = require('http');
const config = require('./config');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, Session, User } = require('./models');

const app = express();
const server = http.createServer(app);
const socketConf = {};
if (config.IS_DEV) {
  socketConf.cors = {
    origin: '*',
  }
}
const io = socketIo(server, socketConf);

app.use(cors());
app.use(bodyParser.json());

const rooms = {};
const socketRoomMap = new Map();

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && user.password === password) {
      res.status(200).send({ username });
    } else {
      res.status(401).send({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', async ({ roomId, username }) => {
    try {
      console.log('Received room join request:', roomId, 'from client:', socket.id, 'for username:', username);
      socket.join(roomId);
      socketRoomMap.set(socket.id, roomId);

      if (!(roomId in rooms)) {
        rooms[roomId] = { users: [], data: [] };
        const session = await Session.findOne({ where: { roomId } });
        if (session) {
          rooms[roomId].data = session.data;
        }
      }

      rooms[roomId].users.push({ id: socket.id, username });
      io.to(roomId).emit('roomUsers', rooms[roomId].users);
      socket.emit('load', rooms[roomId].data);
    } catch (err) {
      console.log('Error in joinRoom event for socket Id', socket.id, err);
    }
  });

  socket.on('draw', ({ data, connectionId }) => {
    try {
      const roomId = socketRoomMap.get(socket.id);
      if (!roomId) {
        console.log('No room found for socket:', socket.id);
        socket.emit('error', 'room not found');
        return;
      }

      rooms[roomId].data.push(data);
      socket.to(roomId).emit('draw', { data, connectionId });
    } catch (err) {
      console.log('Error in draw event for socket Id', socket.id, err);
    }
  });

  socket.on('saveSession', async () => {
    try {
      const roomId = socketRoomMap.get(socket.id);
      if (!roomId) {
        console.log('No room found for socket:', socket.id);
        socket.emit('error', 'room not found');
        return;
      }

      console.log('Received saveSession event from client:', socket.id);
      await Session.upsert({ roomId, data: rooms[roomId].data });
    } catch (err) {
      console.log('Error in saveSession event for socket Id', socket.id, err);
    }
  });

  socket.on('leaveRoom', () => {
    try {
      const roomId = socketRoomMap.get(socket.id);
      if (roomId) {
        console.log('Client left room:', roomId, 'client:', socket.id);
        socket.leave(roomId);
        socketRoomMap.delete(socket.id);

        rooms[roomId].users = rooms[roomId].users.filter(user => user.id !== socket.id);
        io.to(roomId).emit('roomUsers', rooms[roomId].users);
      }
    } catch (err) {
      console.log('Error in leaveRoom event for socket Id', socket.id, err);
    }
  });

  socket.on('disconnect', () => {
    try {
      const roomId = socketRoomMap.get(socket.id);
      if (roomId) {
        console.log('Client disconnected:', socket.id);
        socket.leave(roomId);
        socketRoomMap.delete(socket.id);

        rooms[roomId].users = rooms[roomId].users.filter(user => user.id !== socket.id);
        io.to(roomId).emit('roomUsers', rooms[roomId].users);
      }
    } catch (err) {
      console.log('Error in disconnect event for socket Id', socket.id, err);
    }
  });
});

sequelize.sync().then(() => {
  server.listen(4000, () => console.log(`Server running on port 4000`));
});
