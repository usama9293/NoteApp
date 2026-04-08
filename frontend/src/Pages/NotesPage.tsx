import { useState,useEffect } from "react";
import { archiveNote, deleteNote, getNotes } from "../Services/notesService";
import { useNavigate } from "react-router-dom";
import { NoteStatus, type Note } from "../Types";
import { useAuth } from "../Context/AuthContext";

const noteStatusLabels: Record<Note["status"], string> = {
  [NoteStatus.Active]: 'Active',
  [NoteStatus.Archived]: 'Archived',
  [NoteStatus.Deleted]: 'Deleted',
};



const NotesPage = () => {


  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();


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

  const handleArchive = async (noteId: string) => {
    try {
      await archiveNote(noteId);
      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, status: NoteStatus.Archived } : note
      ));
    } catch (error) {
      console.error("Failed to archive note:", error);
    }
  };

  const handleLogout= () => {
    logout();
    navigate('/login');
  };

  return (

    <div className="container">
      <button onClick={handleLogout}>Logout</button>
      <h2>Your Notes</h2>
      <button onClick={() => navigate('/notes/new')}>Add Note</button>
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
              <p>Status: {noteStatusLabels[note.status]}</p>
              <div className="note-actions">
                <button onClick={() => navigate(`/notes/${note.id}/edit`)}>Edit</button>
                {note.status !== NoteStatus.Archived && (
                  <button onClick={() => handleArchive(note.id)}>Archive</button>
                )}
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