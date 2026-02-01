import "./canvas.js";
import { socket } from "./websocket.js";

/*JOIN LOGIC*/
const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("usernameInput");
const nameModal = document.getElementById("nameModal");
const redoBtn = document.getElementById("redoBtn");
const undoBtn = document.getElementById("undoBtn");

joinBtn.onclick = () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("Enter name");
    return;
  }

  socket.emit("join", name);
  nameModal.style.display = "none";
  document.body.classList.remove("join-pending");
};

/* UNDO*/

undoBtn.onclick = () => socket.emit("undo");


redoBtn.onclick = () => socket.emit("redo");

/*TOOLS*/
const brushBtn = document.getElementById("brushBtn");
const eraserBtn = document.getElementById("eraserBtn");

brushBtn.onclick = () => {
  window.currentTool = "brush";
  brushBtn.classList.add("active");
  eraserBtn.classList.remove("active");
};

eraserBtn.onclick = () => {
  window.currentTool = "eraser";
  eraserBtn.classList.add("active");
  brushBtn.classList.remove("active");
};

/*COLORS*/
document.querySelectorAll(".color-btn").forEach(btn => {
  btn.onclick = () => {
    document
      .querySelectorAll(".color-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    window.currentColor = btn.dataset.color;
  };
});

/*STROKE WIDTH*/
const strokeWidth = document.getElementById("strokeWidth");
strokeWidth.oninput = (e) => {
  window.currentWidth = +e.target.value;
};


const onlineUsers = document.getElementById("onlineUsers");

socket.on("users_update", (users) => {
  onlineUsers.innerHTML = "";

  Object.values(users).forEach(user => {
    const avatar = document.createElement("div");
    avatar.className = "user-avatar";

    // First letter of name
    avatar.textContent = user.name.charAt(0).toUpperCase();

    // User color
    avatar.style.background = user.color;

    // Tooltip with full name
    avatar.title = user.name;

    onlineUsers.appendChild(avatar);
  });
});
