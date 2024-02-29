import './App.css';

function App() {
  return (
    <div className="app-container">
      <form className="note-form">
        <input
          placeholder="title"
          required
        />
        <textarea placeholder="Content"
          rows={10}
          required
        ></textarea>
        <button type="submit">
          Add Note
        </button>
      </form>
      <div className="notes-grid">
        <div className="note-item">
          <button>x</button>
        </div>
        <h2>Note Title</h2>
        <p>Note Content</p>
      </div>
    </div>
  );
}

export default App;
