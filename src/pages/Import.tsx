import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { getClients, saveSession } from '../storage';
import Layout from '../components/Layout';

export default function Import() {
  const [clients, setClients] = useState<Client[]>([]);
  const [transcript, setTranscript] = useState('');
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cls = getClients();
    setClients(cls);
    if (cls.length > 0) setClientId(cls[0].id);
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) { alert('Выберите клиента'); return; }
    if (!transcript.trim()) { alert('Вставьте транскрипт'); return; }
    saveSession({
      id: crypto.randomUUID(),
      clientId,
      date,
      durationMinutes,
      topics: '',
      insights: '',
      homework: '',
      nextSession: '',
      status: 'completed',
      transcript: transcript.trim(),
      source: 'manual',
      createdAt: new Date().toISOString(),
    });
    setTranscript('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <Layout>
      <div className="p-6 max-w-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Импорт транскрипта</h2>
        <p className="text-sm text-slate-500 mb-6">
          Вставьте текст транскрипта вручную. <span className="font-medium text-blue-600">Анализ AI доступен в полной версии.</span>
        </p>

        <form onSubmit={handleSave} className="space-y-4 bg-white shadow rounded-lg p-6">
          <div>
            <label className={labelClass}>Клиент</label>
            <select className={inputClass} value={clientId} onChange={e => setClientId(e.target.value)} required>
              <option value="">— выберите клиента —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.code} — {c.alias}</option>)}
            </select>
            {clients.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">Сначала добавьте клиентов на странице «Клиенты».</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Дата сессии</label>
              <input type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Длительность (мин)</label>
              <input type="number" className={inputClass} value={durationMinutes} onChange={e => setDurationMinutes(Number(e.target.value))} min={1} required />
            </div>
          </div>
          <div>
            <label className={labelClass}>Транскрипт</label>
            <textarea
              className={inputClass}
              rows={12}
              placeholder="Вставьте текст транскрипта сессии здесь..."
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              Сохранить сессию
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">✓ Сохранено!</span>}
          </div>
        </form>
      </div>
    </Layout>
  );
}
