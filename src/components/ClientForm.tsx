import React, { useState } from 'react';
import { Client } from '../types';

interface ClientFormProps {
  initial?: Partial<Client>;
  nextCode: string;
  onSave: (data: Omit<Client, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function ClientForm({ initial, nextCode, onSave, onCancel }: ClientFormProps) {
  const [code, setCode] = useState(initial?.code ?? nextCode);
  const [alias, setAlias] = useState(initial?.alias ?? '');
  const [firstSession, setFirstSession] = useState(initial?.firstSession ?? new Date().toISOString().slice(0, 10));
  const [request, setRequest] = useState(initial?.request ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ code, alias, firstSession, request, notes });
  }

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Код клиента</label>
          <input className={inputClass} value={code} onChange={e => setCode(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Псевдоним</label>
          <input className={inputClass} value={alias} onChange={e => setAlias(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className={labelClass}>Дата первой сессии</label>
        <input type="date" className={inputClass} value={firstSession} onChange={e => setFirstSession(e.target.value)} required />
      </div>
      <div>
        <label className={labelClass}>Запрос</label>
        <textarea className={inputClass} rows={3} value={request} onChange={e => setRequest(e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Заметки</label>
        <textarea className={inputClass} rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
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
