import { useEffect, useState } from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
  priority: string;
  timeEstimate: number;
  completed: boolean;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchTitle, setSearchTitle] = useState("")
  const [priority, setPriority] = useState("low")
  const [timeEstimate, setTimeEstimate] = useState(0)
  const [completed, setCompleted] = useState(false)

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
    setPriority(note.priority)
    setTimeEstimate(note.timeEstimate)
    setCompleted(note.completed)
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
          content,
          priority,
          timeEstimate,
          completed
        })
      });

      const newNote = await response.json()

      setNotes(prev => [...prev, newNote])
      setTitle("")
      setContent("")
      setPriority("low")
      setTimeEstimate(0)
      setCompleted(false)
    } catch (error) {
      console.log(error)
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
          priority,
          timeEstimate,
          completed
        })
      })

      const updatedNote = await response.json()

      const updatedNotesList = notes.map((note) => note.id === selectedNote.id ? updatedNote : note)

      setNotes(updatedNotesList)
      setTitle("")
      setContent("")
      setPriority("low")
      setTimeEstimate(0)
      setCompleted(false)
      setSelectedNote(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setPriority("low")
    setTimeEstimate(0)
    setCompleted(false)
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
          priority,
          timeEstimate,
          completed
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
        <div className="priority-buttons">
          <label htmlFor="low">Low</label>
          <input
            id="low"
            value="low"
            name="priority"
            type="radio"
            defaultChecked
            onChange={(e) => setPriority(e.target.value)}
          />
          <label htmlFor="medium">Medium</label>
          <input
            id="medium"
            value="medium"
            name="priority"
            type="radio"
            onChange={(e) => setPriority(e.target.value)}
          />
          <label htmlFor="high">High</label>
          <input
            id="high"
            value="high"
            name="priority"
            type="radio"
            onChange={(e) => setPriority(e.target.value)}
          />
          <label htmlFor="critical">Critical</label>
          <input
            id="critical"
            value="critical"
            name="priority"
            type="radio"
            onChange={(e) => setPriority(e.target.value)}
          />
        </div>
        <div className="timeEstimate">
          <label htmlFor="timeEstimate">Time Estimate</label>
          <input
            id="timeEstimate"
            placeholder="Time estimate"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(Number(e.target.value))}
          />
        </div>
        <div className="completed">
          <label htmlFor="isCompleted">Completed</label>
          <input
            id="isCompleted"
            value="true"
            name="completed"
            type="radio"
            onChange={() => setCompleted(true)}
          />
          <br />
          <label htmlFor="isNotCompleted">Not completed</label>
          <input
            id="isNotCompleted"
            value="false"
            defaultChecked
            name="completed"
            type="radio"
            onChange={() => setCompleted(false)}
          />
        </div>

        {
    selectedNote ? (
      <div className="edit-buttons">
        <button type="submit">Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    ) : (
      <button type="submit">Add Note</button>
    )
  }
      </form >
      <div className="search-and-sort-functionality">
        <input value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} placeholder="Search by..." />
        <div className="notes-info">
          {notes.length ? (`Number of notes: ${notes.length}`) : ""}
        </div>
      </div>
      <div className="notes-grid">
        {notes.filter(note => searchTitle === "" ? note : note.title.includes(searchTitle) ? note : "").map((note) => (
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
            <p>Priority: {note.priority}</p>
            <p>Time Estimate: {note.timeEstimate}</p>
            <p>{note.completed}</p>
          </div>
        ))}

      </div>
    </div >
  );
}

export default App;
