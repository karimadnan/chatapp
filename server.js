const http = require("http");
const express = require("express");
const path = require("path");
const app = express();
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 4000);
const morgan = require("morgan");
const socketio = require("socket.io");
const cors = require("cors");
var online = [];
const {
  createRoom,
  removeRoom,
  getRoom,
  joinQue,
  leaveQue,
  getQue,
  allRooms,
  updateRoomMessages,
} = require("./backend/users");

app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/online", (req, res) => {
  return res.status(200).send({ data: online.length });
});

const server = http.createServer(app);
const io = socketio(server);

const matchingProc = () => {
  const que = getQue();
  que.map((users) => {
    if (que.length > 1) {
      if (Object.keys(io.sockets.sockets).find((id) => id === users.id)) {
        const { error, peer, room } = createRoom(users.id);

        if (error) return console.log(error, "Auto matching error");

        if (peer) {
          io.sockets.sockets[peer].emit("matched", {
            id: users.id,
            roomID: room,
          });
          io.sockets.sockets[users.id].emit("matched", {
            id: peer,
            roomID: room,
          });
          io.sockets.sockets[users.id].join(room);
          io.sockets.sockets[peer].join(room);
          console.log(getRoom(room), "room created");
        }
      } else {
        leaveQue(users.id);
      }
    }
  });
};

io.on("connection", (socket) => {
  socket.on("joinQue", (callback) => {

    const { error, user } = joinQue({ id: socket.id });

    console.log("User was added to queque");
    if (error) return callback({ error: true, data: error });
    if (user) {
      callback({ user: true, data: user });
      console.log(getQue(), "Queque");
      console.log(Object.keys(io.sockets.sockets), "sockets");
      online.push(socket)
      matchingProc();
    }
  });

  socket.on("sendMessage", ({ message, room, user }, callback) => {
    io.to(room).emit("receiveMessage", { user: user, message: message });
    updateRoomMessages(room, { user: user, message: message });
    callback();
  });

  socket.on("queDc", () => {
    const { error } = leaveQue(socket.id);
    if (error) return console.log(error, "Disconnect Error.");
    var i = online.indexOf(socket);
    online.splice(i, 1);
    console.log("user disconnected from queque");
  });

  socket.on("typing", ({ room, user, status }) => {
    const findRoom = getRoom(room);
    if (findRoom) {
      if (findRoom.inside.user1 === user) {
        io.sockets.sockets[findRoom.inside.user2].emit(
          status ? "setTyping" : "stopTyping"
        );
      } else {
        io.sockets.sockets[findRoom.inside.user1].emit(
          status ? "setTyping" : "stopTyping"
        );
      }
    } else {
      socket.emit("roomKick");
    }
  });

  socket.on("chatDc", ({ room }) => {
    if (room) {
      socket.leave(room, () => {
        io.to(room).emit("receiveMessage", {
          user: "root",
          message: "Stranger has disconnected.",
        });
        io.of("/")
          .in(room)
          .clients((error, socketIds) => {
            if (error) throw error;
            socketIds.forEach((socketId) => {
              io.sockets.sockets[socketId].leave(room);
              io.sockets.sockets[socketId].emit("roomKick");
            });
          });
        removeRoom(room);
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
