import { useEffect, useState } from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("https://localhost:3003/api/notes")
        
        const notes: Note[] = await response.json()

        setNotes(notes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotes()
  },[])

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

  const deleteNote = (
    event: React.MouseEvent,
    noteId: number
  ) => {
    event.stopPropagation()

    const updateNotes = notes.filter(
      (note) => note.id != noteId
    )

    setNotes(updateNotes)
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
              <button
              onClick={(e)=>deleteNote(e, note.id)}
              >x</button>
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
