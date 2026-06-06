import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { getClients, saveClient, updateClient, deleteClient, getSessions } from '../storage';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ClientForm from '../components/ClientForm';
import ClientCard from '../components/ClientCard';

function generateNextCode(clients: Client[]): string {
  if (clients.length === 0) return 'К-001';
  const nums = clients
    .map(c => {
      const m = c.code.match(/\d+$/);
      return m ? parseInt(m[0], 10) : 0;
    })
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `К-${String(max + 1).padStart(3, '0')}`;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);

  function load() {
    const cls = getClients();
    setClients(cls);
    const sessions = getSessions();
    const counts: Record<string, number> = {};
    sessions.forEach(s => { counts[s.clientId] = (counts[s.clientId] ?? 0) + 1; });
    setSessionCounts(counts);
  }

  useEffect(() => { load(); }, []);

  function handleAdd(data: Omit<Client, 'id' | 'createdAt'>) {
    saveClient({ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    setShowAddModal(false);
    load();
  }

  function handleUpdate(data: Omit<Client, 'id' | 'createdAt'>) {
    if (!editClient) return;
    updateClient({ ...editClient, ...data });
    setEditClient(null);
    setViewClient(null);
    load();
  }

  function handleDelete(id: string) {
    if (confirm('Удалить клиента?')) {
      deleteClient(id);
      setViewClient(null);
      load();
    }
  }

  const sorted = [...clients].sort((a, b) => a.code.localeCompare(b.code));

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Клиенты</h2>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            + Добавить клиента
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Код</th>
                <th className="px-4 py-3 text-left font-medium">Псевдоним</th>
                <th className="px-4 py-3 text-left font-medium">Первая сессия</th>
                <th className="px-4 py-3 text-left font-medium">Сессий</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">Клиентов нет</td>
                </tr>
              )}
              {sorted.map((c, i) => (
                <tr
                  key={c.id}
                  className={`cursor-pointer hover:bg-blue-50 border-t border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50'}`}
                  onClick={() => setViewClient(c)}
                >
                  <td className="px-4 py-3 font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.alias}</td>
                  <td className="px-4 py-3">{c.firstSession}</td>
                  <td className="px-4 py-3">{sessionCounts[c.id] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <Modal title="Новый клиент" onClose={() => setShowAddModal(false)}>
          <ClientForm nextCode={generateNextCode(clients)} onSave={handleAdd} onCancel={() => setShowAddModal(false)} />
        </Modal>
      )}

      {viewClient && !editClient && (
        <Modal title={`${viewClient.code} — ${viewClient.alias}`} onClose={() => setViewClient(null)}>
          <ClientCard
            client={viewClient}
            sessions={getSessions().filter(s => s.clientId === viewClient.id)}
            onEdit={() => setEditClient(viewClient)}
            onDelete={() => handleDelete(viewClient.id)}
            onClose={() => setViewClient(null)}
          />
        </Modal>
      )}

      {editClient && (
        <Modal title="Редактировать клиента" onClose={() => setEditClient(null)}>
          <ClientForm initial={editClient} nextCode={editClient.code} onSave={handleUpdate} onCancel={() => setEditClient(null)} />
        </Modal>
      )}
    </Layout>
  );
}
