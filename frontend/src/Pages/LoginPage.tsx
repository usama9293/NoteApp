import  {useState} from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { login as loginApi } from '../Services/authService';
import { useAuth } from '../Context/AuthContext';






const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginApi({ email, password });
      login(user);
      navigate('/notes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap flex min-h-screen items-center justify-center">
      <div className="panel w-full max-w-md space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">NoteApp</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="mt-1 text-sm text-ink-700 dark:text-ink-300">Sign in to manage your notes.</p>
      </div>
      {error && <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <form onSubmit={handleSubmit}>  
        <div className="space-y-4">
        <div>
          <label className="field-label">Email</label>
          <input
            className="input-base"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input
            className="input-base"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        </div>
      </form>
      <p className="text-sm text-ink-700 dark:text-ink-300">
        Don&apos;t have an account?{' '}
        <Link className="font-semibold text-brand hover:text-brand-deep" to="/register">Register</Link>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;

