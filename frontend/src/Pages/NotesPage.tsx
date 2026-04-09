import { useState,useEffect } from "react";
import { archiveNote, deleteNote, searchNotes } from "../Services/notesService";
import { useNavigate } from "react-router-dom";
import { NoteSort, NoteSortOrder, NoteStatus, type Note, type NoteSearchRequestDto } from "../Types";
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
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  });

  const [queryControl, setQueryControl] = useState({
    searchTerm: '',
    status: '' as '' | Note["status"],
    sortBy: NoteSort.CreatedAt,
    sortOrder: NoteSortOrder.Descending,
    includeDeleted: false,
  });



  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const request: NoteSearchRequestDto = {
        searchTerm: queryControl.searchTerm,
        includeDeleted: queryControl.includeDeleted,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        sortBy: queryControl.sortBy,
        sortOrder: queryControl.sortOrder,
        ...(queryControl.status !== '' ? { status: queryControl.status } : {}),
      };

      const response = await searchNotes(request);
      setNotes(response.items);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      }));
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [pagination.pageNumber, pagination.pageSize, queryControl]);

  
  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleArchive = async (noteId: string) => {
    try {
      await archiveNote(noteId);
      fetchNotes();
    } catch (error) {
      console.error("Failed to archive note:", error);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
    setQueryControl(prev => ({ ...prev, searchTerm: value }));
  };

  const handleStatusChange = (value: string) => {
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
    if (value === '') {
      setQueryControl(prev => ({ ...prev, status: '' }));
      return;
    }

    setQueryControl(prev => ({ ...prev, status: Number(value) as Note["status"] }));
  };

  const handleSortByChange = (value: string) => {
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
    setQueryControl(prev => ({ ...prev, sortBy: Number(value) as typeof prev.sortBy }));
  };

  const handleSortOrderChange = (value: string) => {
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
    setQueryControl(prev => ({ ...prev, sortOrder: Number(value) as typeof prev.sortOrder }));
  };

  const handlePageSizeChange = (value: string) => {
    setPagination(prev => ({
      ...prev,
      pageNumber: 1,
      pageSize: Number(value),
    }));
  };

  const goToPreviousPage = () => {
    setPagination(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber - 1) }));
  };

  const goToNextPage = () => {
    setPagination(prev => ({ ...prev, pageNumber: Math.min(prev.totalPages, prev.pageNumber + 1) }));
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
      <div className="form-group">
        <label>Search:</label>
        <input
          type="text"
          value={queryControl.searchTerm}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          placeholder="Search by title or content"
        />
      </div>
      <div className="form-group">
        <label>Status:</label>
        <select value={queryControl.status === '' ? '' : String(queryControl.status)} onChange={(e) => handleStatusChange(e.target.value)}>
          <option value="">All</option>
          <option value={String(NoteStatus.Active)}>Active</option>
          <option value={String(NoteStatus.Archived)}>Archived</option>
          <option value={String(NoteStatus.Deleted)}>Deleted</option>
        </select>
      </div>
      <div className="form-group">
        <label>Sort By:</label>
        <select value={String(queryControl.sortBy)} onChange={(e) => handleSortByChange(e.target.value)}>
          <option value={String(NoteSort.CreatedAt)}>Created At</option>
          <option value={String(NoteSort.UpdatedAt)}>Updated At</option>
          <option value={String(NoteSort.Title)}>Title</option>
        </select>
      </div>
      <div className="form-group">
        <label>Sort Order:</label>
        <select value={String(queryControl.sortOrder)} onChange={(e) => handleSortOrderChange(e.target.value)}>
          <option value={String(NoteSortOrder.Descending)}>Descending</option>
          <option value={String(NoteSortOrder.Ascending)}>Ascending</option>
        </select>
      </div>
      <div className="form-group">
        <label>Page Size:</label>
        <select value={String(pagination.pageSize)} onChange={(e) => handlePageSizeChange(e.target.value)}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
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
      <div className="note-actions">
        <button onClick={goToPreviousPage} disabled={pagination.pageNumber <= 1 || loading}>Previous</button>
        <p>Page {pagination.pageNumber} of {pagination.totalPages} ({pagination.totalCount} total)</p>
        <button onClick={goToNextPage} disabled={pagination.pageNumber >= pagination.totalPages || loading}>Next</button>
      </div>
    </div>
  );

}

export default NotesPage;