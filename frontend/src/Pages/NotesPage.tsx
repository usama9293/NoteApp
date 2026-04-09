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

    <div className="page-wrap space-y-6">
      <div className="panel">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Your Notes</h2>
          <p className="mt-1 text-sm text-ink-700 dark:text-ink-300">Search, sort, and manage your personal note space.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          <button className="btn-primary" onClick={() => navigate('/notes/new')}>Add Note</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div>
        <label className="field-label">Search</label>
        <input
          className="input-base"
          type="text"
          value={queryControl.searchTerm}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          placeholder="Search by title or content"
        />
      </div>
      <div>
        <label className="field-label">Status</label>
        <select className="input-base" value={queryControl.status === '' ? '' : String(queryControl.status)} onChange={(e) => handleStatusChange(e.target.value)}>
          <option value="">All</option>
          <option value={String(NoteStatus.Active)}>Active</option>
          <option value={String(NoteStatus.Archived)}>Archived</option>
          <option value={String(NoteStatus.Deleted)}>Deleted</option>
        </select>
      </div>
      <div>
        <label className="field-label">Sort By</label>
        <select className="input-base" value={String(queryControl.sortBy)} onChange={(e) => handleSortByChange(e.target.value)}>
          <option value={String(NoteSort.CreatedAt)}>Created At</option>
          <option value={String(NoteSort.UpdatedAt)}>Updated At</option>
          <option value={String(NoteSort.Title)}>Title</option>
        </select>
      </div>
      <div>
        <label className="field-label">Sort Order</label>
        <select className="input-base" value={String(queryControl.sortOrder)} onChange={(e) => handleSortOrderChange(e.target.value)}>
          <option value={String(NoteSortOrder.Descending)}>Descending</option>
          <option value={String(NoteSortOrder.Ascending)}>Ascending</option>
        </select>
      </div>
      <div>
        <label className="field-label">Page Size</label>
        <select className="input-base" value={String(pagination.pageSize)} onChange={(e) => handlePageSizeChange(e.target.value)}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      {notes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-100/80 px-4 py-5 text-sm text-ink-700 dark:border-white/10 dark:text-ink-300">No notes found. Create your first note.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map(note => (
            <li key={note.id} className="rounded-xl border border-ink-100/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-night-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <span className="rounded-full border border-ink-100 px-2.5 py-1 text-xs font-medium dark:border-white/15">{noteStatusLabels[note.status]}</span>
              </div>
              <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{note.content}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={() => navigate(`/notes/${note.id}/edit`)}>Edit</button>
                {note.status !== NoteStatus.Archived && (
                  <button className="btn-secondary" onClick={() => handleArchive(note.id)}>Archive</button>
                )}
                <button className="btn-secondary" onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100/80 pt-4 dark:border-white/10">
        <p className="text-sm text-ink-700 dark:text-ink-300">Page {pagination.pageNumber} of {pagination.totalPages} ({pagination.totalCount} total)</p>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={goToPreviousPage} disabled={pagination.pageNumber <= 1 || loading}>Previous</button>
          <button className="btn-secondary" onClick={goToNextPage} disabled={pagination.pageNumber >= pagination.totalPages || loading}>Next</button>
        </div>
      </div>
      </div>
    </div>
  );

}

export default NotesPage;