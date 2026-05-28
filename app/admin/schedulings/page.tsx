'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Plus, Settings, ChevronLeft, ChevronRight, Clock, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Slot {
  time: string;
  available: boolean;
  booked?: string;
  id?: string;
}

// Initial mock data
const initialWeekSlots = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const slots: Record<string, Slot[]> = {};
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

  days.forEach((_, dIdx) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dIdx);
    const dateKey = date.toISOString().split('T')[0];
    slots[dateKey] = times.map((time, tIdx) => ({
      time,
      available: Math.random() > 0.3,
      booked: Math.random() > 0.75 ? `Acme Co ${tIdx + 1}` : undefined,
      id: `slot-${dIdx}-${tIdx}`,
    }));
  });
  return slots;
};

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekSlots, setWeekSlots] = useState(initialWeekSlots());
  const [draggedBooking, setDraggedBooking] = useState<{ dateKey: string; time: string; booked: string } | null>(null);

  const weekStart = new Date(currentWeek);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

  const formatWeekRange = () => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 4);
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const navigateWeek = (direction: number) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
    // Regenerate for new week (demo)
    setWeekSlots(initialWeekSlots());
  };

  // Drag handlers
  const handleDragStart = (dateKey: string, time: string, booked: string, e: React.DragEvent) => {
    setDraggedBooking({ dateKey, time, booked });
    e.dataTransfer.effectAllowed = 'move';
    // Optional: set ghost image
    const ghost = document.createElement('div');
    ghost.className = 'px-3 py-1 bg-[var(--primary)] text-white text-xs rounded';
    ghost.textContent = booked;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetDateKey: string, targetTime: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedBooking) return;

    const { dateKey: sourceDate, time: sourceTime, booked } = draggedBooking;

    if (sourceDate === targetDateKey && sourceTime === targetTime) {
      setDraggedBooking(null);
      return; // Same slot
    }

    setWeekSlots(prev => {
      const updated = { ...prev };

      // Remove from source
      updated[sourceDate] = updated[sourceDate].map(slot => 
        slot.time === sourceTime ? { ...slot, booked: undefined, available: true } : slot
      );

      // Add to target (if available)
      updated[targetDateKey] = updated[targetDateKey].map(slot => 
        slot.time === targetTime && slot.available && !slot.booked 
          ? { ...slot, booked, available: false } 
          : slot
      );

      return updated;
    });

    toast.success(`Rescheduled ${booked} to ${targetTime} on ${new Date(targetDateKey).toLocaleDateString()}`);
    setDraggedBooking(null);
  };

  const handleSlotClick = (dateKey: string, time: string, available: boolean, booked?: string) => {
    if (booked) {
      toast(`Currently booked with ${booked}. Drag to reschedule.`, { description: 'Or use the buttons below.' });
      return;
    }
    if (!available) {
      toast.error('This slot is unavailable');
      return;
    }
    // Quick book flow
    const client = prompt('Client name for booking?') || 'New Client';
    setWeekSlots(prev => {
      const updated = { ...prev };
      updated[dateKey] = updated[dateKey].map(s => 
        s.time === time ? { ...s, booked: client, available: false } : s
      );
      return updated;
    });
    toast.success(`Booked ${time} on ${new Date(dateKey).toLocaleDateString()} for ${client}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-[var(--primary)]" />
            Schedule
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Drag booked items to reschedule • Click empty slots to book instantly
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/schedulings/booking-links" className="btn btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Booking
          </Link>
          <Link href="/admin/schedulings/availability" className="btn btn-secondary flex items-center gap-2">
            <Settings className="w-4 h-4" /> Manage Availability
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between card p-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentWeek(new Date())} className="btn btn-secondary text-sm">Today</button>
          <div className="flex items-center gap-1">
            <button onClick={() => navigateWeek(-1)} className="btn btn-secondary p-2"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => navigateWeek(1)} className="btn btn-secondary p-2"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="font-medium text-lg">{formatWeekRange()}</div>
        </div>
        <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
          <GripVertical className="w-3 h-3" /> Drag to reschedule
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-6 border-b bg-[var(--muted)]/30">
          <div className="p-4 text-xs font-medium text-[var(--muted-foreground)] border-r">Time</div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + idx);
            return (
              <div key={idx} className="p-4 text-center border-r last:border-r-0">
                <div className="font-semibold text-sm">{day}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{date.getDate()}</div>
              </div>
            );
          })}
        </div>

        <div className="divide-y">
          {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((time, tIdx) => {
            const dateKeys = Object.keys(weekSlots).slice(0, 5);
            return (
              <div key={tIdx} className="grid grid-cols-6 hover:bg-[var(--muted)]/30 transition-colors">
                <div className="p-4 text-sm font-mono text-[var(--muted-foreground)] border-r flex items-center">
                  <Clock className="w-3 h-3 mr-2" />{time}
                </div>

                {dateKeys.map((dateKey, dIdx) => {
                  const slot = weekSlots[dateKey][tIdx];
                  const isBooked = !!slot.booked;
                  const isAvailable = slot.available && !isBooked;

                  return (
                    <div
                      key={dIdx}
                      draggable={isBooked}
                      onDragStart={isBooked ? (e) => handleDragStart(dateKey, time, slot.booked!, e) : undefined}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(dateKey, time, e)}
                      onClick={() => handleSlotClick(dateKey, time, slot.available, slot.booked)}
                      className={`p-3 border-r last:border-r-0 min-h-[56px] flex items-center justify-center cursor-pointer transition-all group
                        ${isBooked ? 'bg-[var(--primary-soft)] text-[var(--primary)]' : ''}
                        ${isAvailable ? 'hover:bg-[var(--primary-soft)]/60' : ''}
                        ${draggedBooking && draggedBooking.dateKey !== dateKey ? 'ring-1 ring-[var(--primary)]/30' : ''}
                      `}
                    >
                      {isBooked ? (
                        <div className="flex items-center gap-2 w-full">
                          <GripVertical className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">{slot.booked}</div>
                            <div className="text-[10px] text-[var(--muted-foreground)]">Drag to move</div>
                          </div>
                        </div>
                      ) : isAvailable ? (
                        <div className="text-xs font-medium text-[var(--primary)] opacity-70 group-hover:opacity-100">+ Book</div>
                      ) : (
                        <div className="text-xs text-[var(--muted-foreground)]">Blocked</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[var(--primary-soft)]"></div> Booked (draggable)</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border border-dashed border-[var(--primary)]"></div> Available (click to book)</div>
        </div>
        <div>Drag booked items between slots • All changes sync to AgentMemory</div>
      </div>

      <div className="text-xs text-[var(--muted-foreground)] pt-4 border-t">
        Drag-and-drop powered by native HTML5 API + COSS tokens. In production: real-time collab, conflict detection, and AI-suggested reschedules.
      </div>
    </div>
  );
}
