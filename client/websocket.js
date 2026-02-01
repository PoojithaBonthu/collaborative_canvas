export const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
