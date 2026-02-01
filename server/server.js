const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const stateManager = require("./state-manager");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

/*USER MANAGEMENT*/
const USER_COLORS = [
  "#ff0000", 
  "#0000ff", 
  "#00aa00", 
  "#ffa500", 
  "#800080", 
  "#00ced1", 
];

const users = {}; 
let colorIndex = 0;

/*SOCKET CONNECTION*/

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

 
  socket.emit("sync_state", stateManager.getState());

  let currentStroke = null;

  /* ===== USER JOIN ===== */
  socket.on("join", (name) => {
    const color = USER_COLORS[colorIndex % USER_COLORS.length];
    colorIndex++;

    users[socket.id] = {
      id: socket.id,
      name,
      color,
    };

    console.log(`User joined: ${name} (${color})`);

    // Send user their assigned color
    socket.emit("your_color", color);

    // Broadcast updated user list
    io.emit("users_update", users);
  });

  /* ===== DRAWING (REAL-TIME) ===== */
  socket.on("drawing", (data) => {
    if (!currentStroke) {
      currentStroke = {
        userId: socket.id,
        segments: [],
      };
    }

    currentStroke.segments.push(data);

    // Stream drawing to others
    socket.broadcast.emit("drawing", data);
  });

  /* ===== STROKE END ===== */
  socket.on("stroke_end", () => {
    if (currentStroke) {
      stateManager.addStroke(currentStroke);
      currentStroke = null;
    }
  });

  /* ===== UNDO ===== */
  socket.on("undo", () => {
  stateManager.undo();
  io.emit("sync_state", stateManager.getState());
});

  socket.on("redo", () => {
  stateManager.redo();
  io.emit("sync_state", stateManager.getState());
});


  /* ===== CURSOR MOVE ===== */
  socket.on("cursor_move", (position) => {
    const user = users[socket.id];
    if (!user) return; // user hasn't joined yet

    socket.broadcast.emit("cursor_move", {
      id: socket.id,
      x: position.x,
      y: position.y,
      name: user.name,
      color: user.color,
    });
  });

  /* ===== DISCONNECT ===== */
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    delete users[socket.id];

    // Update online users
    io.emit("users_update", users);

    // Remove cursor
    socket.broadcast.emit("cursor_leave", socket.id);
  });
});

/*SERVER START*/

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

