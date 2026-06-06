import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Session, Client } from '../types';
import { getSessions, saveSession, updateSession, deleteSession, getClients } from '../storage';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import SessionForm from '../components/SessionForm';
import SessionCard from '../components/SessionCard';

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

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filterClient, setFilterClient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTopics, setSearchTopics] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewSession, setViewSession] = useState<Session | null>(null);
  const [editSession, setEditSession] = useState<Session | null>(null);

  function load() {
    setSessions(getSessions());
    setClients(getClients());
  }

  useEffect(() => { load(); }, []);

  function clientOf(id: string) {
    return clients.find(c => c.id === id);
  }

  const filtered = sessions
    .filter(s => !filterClient || s.clientId === filterClient)
    .filter(s => !filterStatus || s.status === filterStatus)
    .filter(s => !searchTopics || s.topics.toLowerCase().includes(searchTopics.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleAdd(data: Omit<Session, 'id' | 'createdAt' | 'source'>) {
    saveSession({ ...data, id: crypto.randomUUID(), source: 'manual', createdAt: new Date().toISOString() });
    setShowAddModal(false);
    load();
  }

  function handleUpdate(data: Omit<Session, 'id' | 'createdAt' | 'source'>) {
    if (!editSession) return;
    updateSession({ ...editSession, ...data });
    setEditSession(null);
    setViewSession(null);
    load();
  }

  function handleDelete(id: string) {
    if (confirm('Удалить сессию?')) {
      deleteSession(id);
      setViewSession(null);
      load();
    }
  }

  function handleExport() {
    const rows = filtered.map(s => {
      const c = clientOf(s.clientId);
      return {
        Дата: s.date,
        Клиент: c ? `${c.code} — ${c.alias}` : s.clientId,
        'Длительность (мин)': s.durationMinutes,
        Темы: s.topics,
        Инсайты: s.insights,
        'Дом. задание': s.homework,
        'Следующая сессия': s.nextSession,
        Статус: statusLabel[s.status],
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Сессии');
    XLSX.writeFile(wb, `sessions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  const selectClass = 'border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Сессии</h2>
          <div className="flex gap-2">
            <button onClick={handleExport} className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
              📊 Экспорт Excel
            </button>
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              + Добавить сессию
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select className={selectClass} value={filterClient} onChange={e => setFilterClient(e.target.value)}>
            <option value="">Все клиенты</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.code} — {c.alias}</option>)}
          </select>
          <select className={selectClass} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Все статусы</option>
            <option value="completed">Проведена</option>
            <option value="cancelled">Отменена</option>
            <option value="rescheduled">Перенесена</option>
          </select>
          <input
            className={selectClass + ' flex-1 min-w-[200px]'}
            placeholder="Поиск по темам..."
            value={searchTopics}
            onChange={e => setSearchTopics(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Дата</th>
                <th className="px-4 py-3 text-left font-medium">Клиент</th>
                <th className="px-4 py-3 text-left font-medium">Длит.</th>
                <th className="px-4 py-3 text-left font-medium">Темы</th>
                <th className="px-4 py-3 text-left font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Сессий нет</td>
                </tr>
              )}
              {filtered.map((s, i) => {
                const c = clientOf(s.clientId);
                return (
                  <tr
                    key={s.id}
                    className={`cursor-pointer hover:bg-blue-50 border-t border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50'}`}
                    onClick={() => setViewSession(s)}
                  >
                    <td className="px-4 py-3">{s.date}</td>
                    <td className="px-4 py-3">{c ? `${c.code} — ${c.alias}` : '—'}</td>
                    <td className="px-4 py-3">{s.durationMinutes} мин</td>
                    <td className="px-4 py-3 max-w-xs truncate">{s.topics}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}>
                        {statusLabel[s.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <Modal title="Новая сессия" onClose={() => setShowAddModal(false)}>
          <SessionForm clients={clients} onSave={handleAdd} onCancel={() => setShowAddModal(false)} />
        </Modal>
      )}

      {/* View modal */}
      {viewSession && !editSession && (
        <Modal title="Сессия" onClose={() => setViewSession(null)}>
          <SessionCard
            session={viewSession}
            client={clientOf(viewSession.clientId)}
            onEdit={() => setEditSession(viewSession)}
            onDelete={() => handleDelete(viewSession.id)}
            onClose={() => setViewSession(null)}
          />
        </Modal>
      )}

      {/* Edit modal */}
      {editSession && (
        <Modal title="Редактировать сессию" onClose={() => setEditSession(null)}>
          <SessionForm initial={editSession} clients={clients} onSave={handleUpdate} onCancel={() => setEditSession(null)} />
        </Modal>
      )}
    </Layout>
  );
}
