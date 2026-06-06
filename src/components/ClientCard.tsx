import React from 'react';
import { Client, Session } from '../types';

interface ClientCardProps {
  client: Client;
  sessions: Session[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const statusLabel: Record<Session['status'], string> = {
  completed: 'Проведена',
  cancelled: 'Отменена',
  rescheduled: 'Перенесена',
};

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export default function ClientCard({ client, sessions, onEdit, onDelete, onClose }: ClientCardProps) {
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-3">
        <Field label="Код" value={client.code} />
        <Field label="Псевдоним" value={client.alias} />
        <Field label="Первая сессия" value={client.firstSession} />
        <div>
          <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Сессий</dt>
          <dd className="mt-0.5 text-sm text-slate-800">{sessions.length}</dd>
        </div>
        <div className="col-span-2"><Field label="Запрос" value={client.request} /></div>
        <div className="col-span-2"><Field label="Заметки" value={client.notes} /></div>
      </dl>

      {sorted.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">История сессий</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sorted.map(s => (
              <div key={s.id} className="bg-slate-50 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{s.date}</span>
                  <span className="text-slate-500">{s.durationMinutes} мин</span>
                  <span className="text-xs text-slate-400">{statusLabel[s.status]}</span>
                </div>
                {s.topics && <p className="text-slate-600 text-xs">{s.topics}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
        <button onClick={onDelete} className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg">
          Удалить
        </button>
        <button onClick={onEdit} className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Редактировать
        </button>
        <button onClick={onClose} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
          Закрыть
        </button>
      </div>
    </div>
  );
}
