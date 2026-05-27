'use client';

import React, { useEffect, useState } from 'react';
import { StatusBadge } from '../../../src/components/admin/StatusBadge';
import { Check, X, MessageSquare, Flag, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  source: string;
  actionHistory: any[];
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks/actions');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch {
      setTasks([]);
    }
    setLoading(false);
  }

  useEffect(() => { loadTasks(); }, []);

  async function performAction(taskId: string, type: any, note?: string) {
    try {
      const res = await fetch('/api/tasks/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, type, note }),
      });
      if (!res.ok) throw new Error('Action failed');
      toast.success(`Action recorded: ${type}`);
      await loadTasks();
    } catch (e) {
      toast.error('Failed to record action');
    }
  }

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending' || t.status === 'in_progress';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks &amp; Opportunities</h1>
          <p className="text-sm text-gray-500">Primary human–agent interface. Agents emit tasks. You act. Everything logs to memory.</p>
        </div>
        <button
          onClick={() => fetch('/api/agent-demo', { method: 'POST' }).then(loadTasks)}
          className="btn btn-primary"
        >
          Ask Agent to Surface Work
        </button>
      </div>

      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Source</th>
              <th>Actions Taken</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No tasks yet. Trigger the demo agent above.</td></tr>}
            {filtered.map(task => (
              <tr key={task.id}>
                <td>
                  <div className="font-medium">{task.title}</div>
                  {task.description && <div className="text-xs text-gray-500 line-clamp-1">{task.description}</div>}
                </td>
                <td><StatusBadge status={task.priority} kind="priority" /></td>
                <td><StatusBadge status={task.status} /></td>
                <td className="text-xs text-gray-500">{task.source}</td>
                <td className="text-xs text-gray-500">{task.actionHistory?.length || 0} actions</td>
                <td className="text-right space-x-1.5">
                  <button onClick={() => performAction(task.id, 'approve')} className="btn btn-success text-xs px-2 py-1"><Check className="w-3 h-3" /></button>
                  <button onClick={() => performAction(task.id, 'reject')} className="btn btn-danger text-xs px-2 py-1"><X className="w-3 h-3" /></button>
                  <button onClick={() => performAction(task.id, 'record_decision', 'Decision recorded')} className="btn btn-secondary text-xs px-2 py-1"><Flag className="w-3 h-3" /></button>
                  <button onClick={() => performAction(task.id, 'provide_input', prompt('Note for agent?') || '')} className="btn btn-secondary text-xs px-2 py-1"><MessageSquare className="w-3 h-3" /></button>
                  <button onClick={() => performAction(task.id, 'defer')} className="btn btn-secondary text-xs px-2 py-1"><Clock className="w-3 h-3" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500">
        Every action here is permanently logged to AgentMemory (L1 strategic events). Agents can later call getRecentActionsForTask and memory_search to close the loop.
      </div>
    </div>
  );
}
