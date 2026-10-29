import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tourist' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await login(form.email, form.password); else await register(form);
      nav('/');
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form onSubmit={submit} className="card mx-auto grid max-w-md gap-3 p-6">
      <h1 className="text-2xl font-extrabold">{isLogin ? 'Log in' : 'Create your account'}</h1>
      {!isLogin && <input className="input" placeholder="Full name" required value={form.name} onChange={set('name')} aria-label="Full name" />}
      <input className="input" type="email" placeholder="Email" required value={form.email} onChange={set('email')} aria-label="Email" />
      <input className="input" type="password" placeholder="Password (6+ characters)" minLength="6" required value={form.password} onChange={set('password')} aria-label="Password" />
      {!isLogin && (
        <select className="input" value={form.role} onChange={set('role')} aria-label="Account type">
          <option value="tourist">I'm a tourist</option>
          <option value="operator">I run beach activities</option>
        </select>
      )}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button className="btn">{isLogin ? 'Log in' : 'Sign up'}</button>
      <p className="text-sm text-slate-600">
        {isLogin ? <>New here? <Link className="font-semibold underline" to="/register">Create an account</Link></>
                 : <>Already have an account? <Link className="font-semibold underline" to="/login">Log in</Link></>}
      </p>
    </form>
  );
}
