import React, { useState, useEffect, useCallback } from 'react';

const TextEditor: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [undoStack, setUndoStack] = useState<string[]>(['']);
    const [redoStack, setRedoStack] = useState<string[]>([]);
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);

    const saveState = (newText: string) => {
        if (undoStack[undoStack.length - 1] !== newText) {
            setUndoStack([...undoStack, newText]);
            setRedoStack([]);
        }
    };

    const undo = useCallback(() => {
        if (undoStack.length <= 1) return;

        const lastState = undoStack[undoStack.length - 2];
        setRedoStack([text, ...redoStack]);
        setText(lastState);
        setUndoStack(undoStack.slice(0, -1));
    }, [text, undoStack, redoStack]);

    const redo = useCallback(() => {
        if (redoStack.length === 0) return;

        const lastState = redoStack[0];
        setUndoStack([...undoStack, lastState]);
        setText(lastState);
        setRedoStack(redoStack.slice(1));
    }, [text, undoStack, redoStack]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault();
            undo();
        } else if (event.ctrlKey && event.key === 'y') {
            event.preventDefault();
            redo();
        } else if (event.key === 'Backspace') {
            saveState(text);
        }
    }, [text, undo, redo]);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        const lastChar = newText[newText.length - 1];
        const isWordBoundary = /[\s\W]/.test(lastChar);

        if (isWordBoundary) {
            saveState(text);
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(window.setTimeout(() => {
            saveState(newText);
        }, 1000));

        setText(newText);
    };

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