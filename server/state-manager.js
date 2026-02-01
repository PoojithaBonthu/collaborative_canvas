class StateManager {
  constructor() {
    this.strokes = [];
    this.redoStack = [];
  }

  addStroke(stroke) {
    this.strokes.push(stroke);
    this.redoStack = []; // clear redo on new action
  }

  undo() {
    if (this.strokes.length === 0) return;
    const stroke = this.strokes.pop();
    this.redoStack.push(stroke);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const stroke = this.redoStack.pop();
    this.strokes.push(stroke);
  }

  getState() {
    return this.strokes;
  }
}

module.exports = new StateManager();
