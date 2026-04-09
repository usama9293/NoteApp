import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createNote, getNoteById, updateNote } from '../Services/notesService'
import { useAuth } from '../Context/AuthContext'

export default function NoteFormPage() {

        const [title, setTitle] = useState('');
        const [content, setContent] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
        const navigate = useNavigate();
        const { id } = useParams<{ id: string }>();
        const { user } = useAuth();
        const isEditMode = !!id


        useEffect(() => {
            if (id) {
                fetchNote();
            }
        }, [id]);

        const fetchNote = async () => {
            setLoading(true);
            setError('');
            try {
                const note = await getNoteById(id!);
                setTitle(note.title);
                setContent(note.content);
            } catch {
                setError('Failed to load note. Please try again.');
            } finally {
                setLoading(false);
            }   
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setLoading(true);

            try {
                if (isEditMode) {
                    await updateNote(id!, { title, content });
                } else {
                    if (!user?.id) {
                        setError('Please login again to create a note.');
                        return;
                    }

                    await createNote({ title, content, userId: user.id });
                }
                navigate('/notes');
            } catch {
                setError('Failed to save note. Please try again.');
            }
                finally {
                setLoading(false);
            }
        };

    return (
       <div>
        <h2>{isEditMode ? 'Edit Note' : 'Create Note'}</h2>
        {error && <p className="error">{error}</p>} 
        <form onSubmit={handleSubmit}>
    
            <div className="form-group">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Note'}
            </button>
            <button type="button" onClick={() => navigate('/notes')}>
  Cancel
</button>
        </form>
         </div>
    );

}