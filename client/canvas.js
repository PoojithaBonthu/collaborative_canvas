import { socket } from "./websocket.js";

const drawCanvas = document.getElementById("drawCanvas");
const cursorCanvas = document.getElementById("cursorCanvas");

const drawCtx = drawCanvas.getContext("2d");
const cursorCtx = cursorCanvas.getContext("2d");

window.currentTool = "brush";
window.currentColor = "#000000";
window.currentWidth = 3;

const cursors = {};
let isDrawing = false;
let lastPos = null;
let joined = false;

socket.on("your_color", (color) => {
  window.currentColor = color;
  joined = true;
});

function resize() {
  drawCanvas.width = cursorCanvas.width = window.innerWidth;
  drawCanvas.height = cursorCanvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function drawLine(start, end, color, width, tool) {
  drawCtx.save();
  drawCtx.globalCompositeOperation =
    tool === "eraser" ? "destination-out" : "source-over";
  drawCtx.strokeStyle = color;
  drawCtx.lineWidth = width;
  drawCtx.lineCap = "round";
  drawCtx.beginPath();
  drawCtx.moveTo(start.x, start.y);
  drawCtx.lineTo(end.x, end.y);
  drawCtx.stroke();
  drawCtx.restore();
}

drawCanvas.onmousedown = e => {
  isDrawing = true;
  lastPos = { x: e.clientX, y: e.clientY };
};

drawCanvas.onmousemove = e => {
  const pos = { x: e.clientX, y: e.clientY };

  if (joined) socket.emit("cursor_move", pos);

  if (!isDrawing) return;

  drawLine(lastPos, pos, currentColor, currentWidth, currentTool);
  socket.emit("drawing", { start: lastPos, end: pos, color: currentColor, width: currentWidth, tool: currentTool });
  lastPos = pos;
};

drawCanvas.onmouseup = () => {
  isDrawing = false;
  socket.emit("stroke_end");
};

socket.on("drawing", data => {
  drawLine(data.start, data.end, data.color, data.width, data.tool);
});

socket.on("sync_state", strokes => {
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  strokes.forEach(s =>
    s.segments.forEach(seg =>
      drawLine(seg.start, seg.end, seg.color, seg.width, seg.tool)
    )
  );
});

socket.on("cursor_move", d => {
  cursors[d.id] = d;
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  Object.values(cursors).forEach(c => {
    cursorCtx.fillStyle = c.color;
    cursorCtx.beginPath();
    cursorCtx.arc(c.x, c.y, 5, 0, Math.PI * 2);
    cursorCtx.fill();
    cursorCtx.fillText(c.name, c.x + 8, c.y - 8);
  });
});

socket.on("cursor_leave", id => {
  delete cursors[id];
});
