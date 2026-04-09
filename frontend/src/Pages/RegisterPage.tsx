import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../Services/authService';




const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerApi({ firstName, lastName, email, password });
      navigate('/login');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap flex min-h-screen items-center justify-center">
      <div className="panel w-full max-w-md space-y-6">
      <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">NoteApp</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Create account</h2>
      <p className="mt-1 text-sm text-ink-700 dark:text-ink-300">Start writing and organizing notes.</p>
      </div>
      {error && <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
        <div>
          <label className="field-label">First Name</label>
          <input
            className="input-base"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label">Last Name</label>
          <input
            className="input-base"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
          {loading ? 'Registering...' : 'Register'}
        </button>
        </div>
      </form>
      <p className="text-sm text-ink-700 dark:text-ink-300">
        Already have an account?{' '}
        <Link className="font-semibold text-brand hover:text-brand-deep" to="/login">Login</Link>
      </p>
      </div>
    </div>
  );
};

export default RegisterPage;

