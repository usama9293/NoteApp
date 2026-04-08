import { useState,useEffect } from "react";
import { getNotes,deleteNote } from "../Services/notesService";
import { useNavigate } from "react-router-dom";
import type { Note } from "../Types";



const NotesPage = () => {


  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  
  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <div className="container">
      <h2>Your Notes</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {notes.length === 0 ? (
        <p>No notes found. Create your first note!</p>
      ) : (
        <ul className="notes-list">
          {notes.map(note => (
            <li key={note.id} className="note-item">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="note-actions">
                <button onClick={() => navigate(`/notes/${note.id}/edit`)}>Edit</button>
                <button onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}

export default NotesPage;