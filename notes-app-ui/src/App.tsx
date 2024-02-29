import { useState } from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "note title 1",
      content: "note content 1"
    },
    {
      id: 2,
      title: "note title 2",
      content: "note content 2"
    },
    {
      id: 3,
      title: "note title 3",
      content: "note content 3"
    },
    {
      id: 4,
      title: "note title 4",
      content: "note content 4"
    },
  ]);

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const handleNoteClick = (note:Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleAddNote = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content
    }

    setNotes(prev => [...prev, newNote])
    setTitle("")
    setContent("")
  }

  const handleUpdateNote = (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    if (!selectedNote) {
      return;
    }

    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    }

    const updatedNotesList = notes.map((note) => note.id === selectedNote.id ? updatedNote : note)

    setNotes(updatedNotesList)
    setTitle("")
    setContent("")
    setSelectedNote(null)
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null)
  }

  return (
    <div className="app-container">
      <form className="note-form"
      onSubmit={(e) => selectedNote ? handleUpdateNote(e) : handleAddNote(e)}
      >
        <input
          placeholder="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          placeholder="Content"
          rows={10}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )
      }

        <button type="submit">
          Add Note
        </button>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div 
          key={note.id} 
          className="note-item"
          onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
