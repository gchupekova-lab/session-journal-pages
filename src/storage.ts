import { Client, Session } from './types';

const CLIENTS_KEY = 'sj_clients';
const SESSIONS_KEY = 'sj_sessions';

export function getClients(): Client[] {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveClient(client: Client): void {
  const clients = getClients();
  clients.push(client);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function updateClient(client: Client): void {
  const clients = getClients().map(c => c.id === client.id ? client : c);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function deleteClient(id: string): void {
  const clients = getClients().filter(c => c.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: Session): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function updateSession(session: Session): void {
  const sessions = getSessions().map(s => s.id === session.id ? session : s);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter(s => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}
