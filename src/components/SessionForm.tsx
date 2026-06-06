import React, { useState } from 'react';
import { Session, Client } from '../types';

interface SessionFormProps {
  initial?: Partial<Session>;
  clients: Client[];
  onSave: (data: Omit<Session, 'id' | 'createdAt' | 'source'>) => void;
  onCancel: () => void;
}

export default function SessionForm({ initial, clients, onSave, onCancel }: SessionFormProps) {
  const [clientId, setClientId] = useState(initial?.clientId ?? (clients[0]?.id ?? ''));
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [durationMinutes, setDurationMinutes] = useState(initial?.durationMinutes ?? 50);
  const [topics, setTopics] = useState(initial?.topics ?? '');
  const [insights, setInsights] = useState(initial?.insights ?? '');
  const [homework, setHomework] = useState(initial?.homework ?? '');
  const [nextSession, setNextSession] = useState(initial?.nextSession ?? '');
  const [status, setStatus] = useState<Session['status']>(initial?.status ?? 'completed');
  const [transcript, setTranscript] = useState(initial?.transcript ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ clientId, date, durationMinutes, topics, insights, homework, nextSession, status, transcript });
  }

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Клиент</label>
        <select className={inputClass} value={clientId} onChange={e => setClientId(e.target.value)} required>
          <option value="">— выберите клиента —</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.code} — {c.alias}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Дата</label>
          <input type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Длительность (мин)</label>
          <input type="number" className={inputClass} value={durationMinutes} onChange={e => setDurationMinutes(Number(e.target.value))} min={1} required />
        </div>
      </div>
      <div>
        <label className={labelClass}>Темы</label>
        <textarea className={inputClass} rows={2} value={topics} onChange={e => setTopics(e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Инсайты</label>
        <textarea className={inputClass} rows={2} value={insights} onChange={e => setInsights(e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Домашнее задание</label>
        <textarea className={inputClass} rows={2} value={homework} onChange={e => setHomework(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Следующая сессия</label>
          <input type="date" className={inputClass} value={nextSession} onChange={e => setNextSession(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Статус</label>
          <select className={inputClass} value={status} onChange={e => setStatus(e.target.value as Session['status'])}>
            <option value="completed">Проведена</option>
            <option value="cancelled">Отменена</option>
            <option value="rescheduled">Перенесена</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Транскрипт</label>
        <textarea className={inputClass} rows={4} value={transcript} onChange={e => setTranscript(e.target.value)} placeholder="Вставьте транскрипт сессии..." />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
          Отмена
        </button>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Сохранить
        </button>
      </div>
    </form>
  );
}
