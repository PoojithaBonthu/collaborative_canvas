Real-Time Collaborative Drawing Canvas
    A real-time multi-user drawing application where multiple users can draw simultaneously on a shared canvas.
    The application supports live drawing sync, global undo/redo, user cursors with names, and online user indicators.

Features
    Real-time collaborative drawing using HTML5 Canvas
    Live cursor tracking with user name + color
    Global Undo / Redo (any user can undo or redo any drawing)
    Brush and eraser tools
    Color selection and stroke width control
    Online users displayed as colored initials
    Server-authoritative state management using WebSockets

Tech Stack
    Frontend: HTML, CSS, Vanilla JavaScript (Canvas API)
    Backend: Node.js, Express
    Real-time Communication: Socket.IO
    State Management: Server-side stroke history

Setup Instructions
 Prerequisites
    Node.js v18+
    npm

Clone the Repository

    git clone <your-github-repo-url>
    cd collaborative-canvas

Install Dependencies
    npm install

Start the Application
    npm start 

This will start the WebSocket server on:
    http://localhost:3000

Start the Client
    In a new terminal:

    cd client
    python3 -m http.server 5500
    Open in browser:

    http://localhost:5500

⚠️ Do not open the HTML file directly (file://).

How to Test with Multiple Users
    Open two or more browser windows (or different browsers).
    Go to http://localhost:5500 in each window.
    Enter a different name in each window.

    Start drawing:

    Drawings appear in real time across all users.
    Cursor positions with user names are visible.
    Click Undo / Redo from any user:
    The canvas updates for all users.

Undo / Redo Behavior

    Undo and Redo are global
    Any user can undo or redo the most recent drawing

Server maintains:

    Global stroke history
    Redo stack
    Canvas is re-rendered from server state after every undo/redo

Known Limitations / Bugs

    Redo stack is cleared when a new drawing action occurs
    No persistence after server restart (in-memory state only)
    Touch input (mobile drawing) is not implemented
    No authentication (users identified only by name)
    Performance may degrade with extremely large stroke histories


Time Spent on the Project

    Task	                   Time
    Canvas drawing & tools	~  4 hours
    WebSocket real-time sync ~ 3 hours
    Global undo/redo logic	~  4 hours
    User management & cursors ~3 hours
    UI & UX improvements	~  2 hours
    Debugging & testing	    ~  2 hours
        Total	    ~      18 hours

Project Structure

collaborative-canvas/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── canvas.js
│   ├── websocket.js
│   └── main.js
├── server/
│   ├── server.js
│   ├── state-manager.js
│   └── rooms.js
├── package.json
├── README.md
└── ARCHITECTURE.md