import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PASSWORD = 'psychologist';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const stored = localStorage.getItem('sj_auth') ?? DEFAULT_PASSWORD;
    if (password === stored || (stored === DEFAULT_PASSWORD && password === DEFAULT_PASSWORD)) {
      sessionStorage.setItem('sj_auth', 'ok');
      navigate('/');
    } else {
      setError('Неверный пароль');
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">📓 Журнал сессий</h1>
        <p className="text-sm text-slate-500 text-center mb-6">Введите пароль для входа</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            autoFocus
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Пароль"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
