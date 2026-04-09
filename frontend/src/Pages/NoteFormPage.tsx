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
       <div className="page-wrap">
        <div className="panel mx-auto max-w-2xl space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">{isEditMode ? 'Edit Note' : 'Create Note'}</h2>
        {error && <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</p>} 
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
            <div>
                <label className="field-label">Title</label>
                <input
                    className="input-base"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="field-label">Content</label>
                <textarea
                    className="input-base min-h-40"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div className="flex flex-wrap gap-3">
            <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Note'}
            </button>
            <button className="btn-secondary" type="button" onClick={() => navigate('/notes')}>
              Cancel
            </button>
            </div>
            </div>
        </form>
         </div>
       </div>
    );

}