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
  const [view, setView] = useState<'week' | 'month'>('week');
  const [weekSlots, setWeekSlots] = useState(initialWeekSlots());
  const [draggedBooking, setDraggedBooking] = useState<{ dateKey: string; time: string; booked: string } | null>(null);

  const weekStart = new Date(currentWeek);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

  const formatWeekRange = () => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 4);
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const navigate = (direction: number) => {
    if (view === 'week') {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(newWeek.getDate() + direction * 7);
      setCurrentWeek(newWeek);
      setWeekSlots(initialWeekSlots());
    } else {
      const newMonth = new Date(currentWeek);
      newMonth.setMonth(newMonth.getMonth() + direction);
      setCurrentWeek(newMonth);
    }
  };

  // Month view helpers
  const monthStart = new Date(currentWeek.getFullYear(), currentWeek.getMonth(), 1);
  const monthEnd = new Date(currentWeek.getFullYear(), currentWeek.getMonth() + 1, 0);
  const startDay = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();

  const monthDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startDay + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const handleDragStart = (dateKey: string, time: string, booked: string, e: React.DragEvent) => {
    setDraggedBooking({ dateKey, time, booked });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetDateKey: string, targetTime: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedBooking) return;
    const { dateKey: sourceDate, time: sourceTime, booked } = draggedBooking;
    if (sourceDate === targetDateKey && sourceTime === targetTime) { setDraggedBooking(null); return; }

    setWeekSlots(prev => {
      const updated = { ...prev };
      updated[sourceDate] = updated[sourceDate].map(s => s.time === sourceTime ? { ...s, booked: undefined, available: true } : s);
      if (updated[targetDateKey]) {
        updated[targetDateKey] = updated[targetDateKey].map(s => s.time === targetTime && s.available && !s.booked ? { ...s, booked, available: false } : s);
      }
      return updated;
    });
    toast.success(`Rescheduled ${booked} to ${targetTime}`);
    setDraggedBooking(null);
  };

  const handleSlotClick = (dateKey: string, time: string, available: boolean, booked?: string) => {
    if (booked) { toast(`Booked with ${booked}. Drag to reschedule.`); return; }
    if (!available) { toast.error('Slot unavailable'); return; }
    const client = prompt('Client name?') || 'New Client';
    setWeekSlots(prev => {
      const updated = { ...prev };
      if (updated[dateKey]) updated[dateKey] = updated[dateKey].map(s => s.time === time ? { ...s, booked: client, available: false } : s);
      return updated;
    });
    toast.success(`Booked ${time} for ${client}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-[var(--primary)]" /> Schedule
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Week or Month view • Drag to reschedule</p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg border overflow-hidden">
            <button onClick={() => setView('week')} className={`px-4 py-1.5 text-sm ${view === 'week' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)]'}`}>Week</button>
            <button onClick={() => setView('month')} className={`px-4 py-1.5 text-sm ${view === 'month' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)]'}`}>Month</button>
          </div>
          <Link href="/admin/schedulings/booking-links" className="btn btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Booking</Link>
          <Link href="/admin/schedulings/availability" className="btn btn-secondary flex items-center gap-2"><Settings className="w-4 h-4" /> Availability</Link>
        </div>
      </div>

      <div className="flex items-center justify-between card p-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentWeek(new Date())} className="btn btn-secondary text-sm">Today</button>
          <div className="flex items-center gap-1">
            <button onClick={() => navigate(-1)} className="btn btn-secondary p-2"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => navigate(1)} className="btn btn-secondary p-2"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="font-medium text-lg">
            {view === 'week' ? formatWeekRange() : currentWeek.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="text-xs text-[var(--muted-foreground)]">{view === 'week' ? 'Drag booked items' : 'Click day for details'}</div>
      </div>

      {view === 'week' ? (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-6 border-b bg-[var(--muted)]/30">
            <div className="p-4 text-xs font-medium text-[var(--muted-foreground)] border-r">Time</div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => {
              const date = new Date(weekStart); date.setDate(date.getDate() + idx);
              return <div key={idx} className="p-4 text-center border-r last:border-r-0"><div className="font-semibold text-sm">{day}</div><div className="text-xs text-[var(--muted-foreground)]">{date.getDate()}</div></div>;
            })}
          </div>
          <div className="divide-y">
            {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((time, tIdx) => {
              const dateKeys = Object.keys(weekSlots).slice(0, 5);
              return (
                <div key={tIdx} className="grid grid-cols-6 hover:bg-[var(--muted)]/30">
                  <div className="p-4 text-sm font-mono text-[var(--muted-foreground)] border-r flex items-center"><Clock className="w-3 h-3 mr-2" />{time}</div>
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
                        `}
                      >
                        {isBooked ? (
                          <div className="flex items-center gap-2 w-full">
                            <GripVertical className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{slot.booked}</div><div className="text-[10px] text-[var(--muted-foreground)]">Drag to move</div></div>
                          </div>
                        ) : isAvailable ? <div className="text-xs font-medium text-[var(--primary)] opacity-70 group-hover:opacity-100">+ Book</div> : <div className="text-xs text-[var(--muted-foreground)]">Blocked</div>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-lg overflow-hidden">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-center text-[10px] py-2 bg-[var(--card)] text-[var(--muted-foreground)]">{d}</div>)}
            {monthDays.map((day, idx) => {
              const isToday = day && new Date().getDate() === day && currentWeek.getMonth() === new Date().getMonth();
              const hasBookings = day && Math.random() > 0.6;
              return (
                <div key={idx} onClick={() => day && toast(`Day ${day} — ${hasBookings ? '3 bookings' : 'No bookings'}`)}
                  className={`min-h-[92px] p-2 text-sm bg-[var(--card)] hover:bg-[var(--muted)]/50 cursor-pointer transition-all ${isToday ? 'ring-2 ring-[var(--primary)]' : ''}`}>
                  {day && <>
                    <div className="font-medium text-right">{day}</div>
                    {hasBookings && <div className="mt-1 text-[10px] px-1.5 py-0.5 bg-[var(--primary-soft)] text-[var(--primary)] rounded w-fit">3 slots</div>}
                  </>}
                </div>
              );
            })}
          </div>
          <div className="text-xs text-center text-[var(--muted-foreground)] mt-4">Click any day for details • Month view (demo data)</div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[var(--primary-soft)]"></div> Booked (draggable)</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border border-dashed border-[var(--primary)]"></div> Available</div>
        </div>
        <div>Week + Month views • COSS UI • Real-time Agent sync</div>
      </div>
    </div>
  );
}
