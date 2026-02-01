Overview

    This project is a real-time collaborative drawing canvas where multiple users can draw on the same board simultaneously.
    The system uses WebSockets (Socket.IO) for real-time communication, and the server acts as the single source of truth.

1. Data Flow
    How drawing data moves between users
    User A (Browser)
    │
    │ drawing / cursor events
    ▼
    Server (Socket.IO)
    │
    │ broadcast events
    ▼
    User B, User C (Browsers)

Drawing Flow

    User draws on the canvas.
    The browser captures stroke segments.
    The stroke data is sent to the server.
    The server broadcasts the data to all other users.
    All connected users see the drawing in real time.

2. WebSocket Protocol

Client → Server Events

    join – User joins with a name
    drawing – Sends stroke segment data
    stroke_end – Indicates stroke completion
    cursor_move – Sends cursor position
    undo – Undo last global stroke
    redo – Redo last undone stroke

Server → Client Events

    drawing – Live drawing updates
    sync_state – Full canvas state
    cursor_move – Other users’ cursor positions
    cursor_leave – Remove cursor on disconnect
    users_update – Online users list
    your_color – Assigned user color

3. Undo / Redo Strategy (Global)

    Undo and redo are global, not per user.
    
    The server stores:
    strokes[] – Current drawing history
    redoStack[] – Undone strokes

    Any user can undo or redo any drawing.
    After undo/redo, the server sends the full state.
    Clients clear the canvas and redraw everything.

4. Performance Decisions

    Stroke segments are sent instead of pixels (low bandwidth).
    Drawing is rendered locally first for smooth experience.
    Canvas is split into layers:

        Drawing layer (permanent)
        Cursor layer (temporary)

    Full canvas is redrawn only when undo/redo happens.

5. Conflict Handling

    Multiple users can draw at the same time.
    The server processes drawing events in arrival order.
    Overlapping drawings are handled naturally by draw order.
    No locking is used to keep the experience smooth.

Summary

    WebSockets enable real-time collaboration.
    The server controls global state.
    Undo/Redo works across all users.
    The design prioritizes smoothness and simplicity.