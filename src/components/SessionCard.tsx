import React from 'react';
import { Session, Client } from '../types';

interface SessionCardProps {
  session: Session;
  client?: Client;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const statusLabel: Record<Session['status'], string> = {
  completed: 'Проведена',
  cancelled: 'Отменена',
  rescheduled: 'Перенесена',
};

const statusColor: Record<Session['status'], string> = {
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  rescheduled: 'bg-yellow-100 text-yellow-800',
};

function Field({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export default function SessionCard({ session, client, onEdit, onDelete, onClose }: SessionCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[session.status]}`}>
          {statusLabel[session.status]}
        </span>
        <span className="text-sm text-slate-500">{session.date}</span>
        {client && <span className="text-sm font-medium text-slate-700">{client.code} — {client.alias}</span>}
      </div>
      <dl className="space-y-3">
        <Field label="Длительность" value={`${session.durationMinutes} мин`} />
        <Field label="Темы" value={session.topics} />
        <Field label="Инсайты" value={session.insights} />
        <Field label="Домашнее задание" value={session.homework} />
        <Field label="Следующая сессия" value={session.nextSession} />
        {session.transcript && (
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Транскрипт</dt>
            <dd className="mt-0.5 text-sm text-slate-800 bg-slate-50 rounded p-2 max-h-48 overflow-y-auto whitespace-pre-wrap">
              {session.transcript}
            </dd>
          </div>
        )}
      </dl>
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
