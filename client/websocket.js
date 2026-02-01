export const socket = io(
  "https://collaborative-canvas-bz4g.onrender.com",
  {
    transports: ["websocket"],
    secure: true,
  }
);

socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
