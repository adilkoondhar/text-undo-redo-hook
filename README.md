# text-undo-redo-hook
A React-based smart undo/redo hook for text editors. Easily integrate into any text input field to enable advanced undo/redo functionality based on word-level changes, keyboard hotkeys, and intelligent state tracking.

## Features
- **Word-level tracking:** Undo/redo complete words rather than individual characters.
- **Hotkey support:** Use Ctrl+Z & Ctrl+Y for quick undo/redo.
- **Intelligent state saving:** Saves state on pauses in typing and when non-alphanumeric characters (e.g., `?`, `.`, `,`, `-`) or the first backspace is hit.
- **Debounced state updates:** Prevents unnecessary state saves for optimal performance.
