'use client';

import React from 'react';

export default function AIPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI &amp; Agents</h1>
      <div className="card p-6">
        <p className="text-sm text-gray-600 mb-4">Agent runtime, memory tuning, and demo tooling live here. Use the Tasks page or the "Ask Agent" buttons throughout the app to trigger work.</p>
        <a href="/api/agent-demo" className="btn btn-primary">Trigger Demo Agent Run</a>
      </div>
    </div>
  );
}
