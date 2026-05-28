'use client';
import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. This is the complete application layer.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-semibold">14</div>
          <div className="text-sm text-gray-500">Open Tasks</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold">7</div>
          <div className="text-sm text-gray-500">Active Jobs</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold">$312k</div>
          <div className="text-sm text-gray-500">Pipeline Value</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold">$412k</div>
          <div className="text-sm text-gray-500">Cash Position</div>
        </div>
      </div>

      <div className="card p-6">
        <div className="font-semibold mb-2">Recent Tasks</div>
        <div className="text-sm text-gray-500">No tasks yet. Demo mode.</div>
      </div>

      <div className="text-xs text-gray-400 pt-4 border-t">Proto-2 • Complete application layer</div>
    </div>
  );
}
