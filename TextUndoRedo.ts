import React, { useState, useEffect, useCallback } from 'react';

const TextEditor: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [undoStack, setUndoStack] = useState<string[]>([]);
    const [redoStack, setRedoStack] = useState<string[]>([]);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUndoStack([...undoStack, text]);
        setText(event.target.value);
        setRedoStack([]);
    };

    const undo = useCallback(() => {
        if (undoStack.length === 0) return;

        const lastState = undoStack[undoStack.length - 1];
        setRedoStack([...redoStack, text]);
        setText(lastState);
        setUndoStack(undoStack.slice(0, -1));
    }, [text, undoStack, redoStack]);

    const redo = useCallback(() => {
        if (redoStack.length === 0) return;

        const lastState = redoStack[redoStack.length - 1];
        setUndoStack([...undoStack, text]);
        setText(lastState);
        setRedoStack(redoStack.slice(0, -1));
    }, [text, undoStack, redoStack]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault();
            undo();
        } else if (event.ctrlKey && event.key === 'y') {
            event.preventDefault();
            redo();
        }
    }, [undo, redo]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div>
            <textarea
                value={text}
                onChange={handleTextChange}
                rows={10}
                cols={50}
                placeholder="Type your message here..."
            />
            <div>
                <button onClick={undo}>Undo (Ctrl+Z)</button>
                <button onClick={redo}>Redo (Ctrl+Y)</button>
            </div>
        </div>
    );
};

export default TextEditor;