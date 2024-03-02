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
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:3003/api/notes")

        const notes: Note[] = await response.json()

        setNotes(notes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotes()
  }, [])

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleAddNote = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {

      const response = await fetch("http://localhost:3003/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content
        })
      });

      const newNote = await response.json()

      setNotes(prev => [...prev, newNote])
      setTitle("")
      setContent("")
    } catch (error) {

    }
  }

  const handleUpdateNote = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3003/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        })
      })

      const updatedNote = await response.json()

      const updatedNotesList = notes.map((note) => note.id === selectedNote.id ? updatedNote : note)

      setNotes(updatedNotesList)
      setTitle("")
      setContent("")
      setSelectedNote(null)
    } catch (error) {
      console.log(error)
    }


  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null)
  }

  const deleteNote = async (
    event: React.MouseEvent,
    noteId: number
  ) => {
    event.stopPropagation()

    try {

      await fetch(`http://localhost:3003/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        })
      })

      const updateNotes = notes.filter(
        (note) => note.id != noteId
      )
  
      setNotes(updateNotes)
    } catch (error) {
      console.log(error)
    }
    return;
  }

  return (
    <div className="app-container">
      <form className="note-form"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => selectedNote ? handleUpdateNote(e) : handleAddNote(e)}
      >
        <input
          placeholder="Title"
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
      </form>
      <div className="search-and-sort-functionality">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by..." />
        <div className="notes-info">
          {notes.length ? (`Number of notes: ${notes.length}`) : ""}
        </div>
      </div>
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button
                onClick={(e) => deleteNote(e, note.id)}
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
