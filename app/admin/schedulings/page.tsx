'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Plus, Settings, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Mock weekly availability data (9am-5pm slots)
const generateWeekSlots = (startDate: Date) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const slots: Record<string, { time: string; available: boolean; booked?: string }[]> = {};
  
  days.forEach((day, dIdx) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dIdx);
    const dateKey = date.toISOString().split('T')[0];
    slots[dateKey] = times.map((time, tIdx) => ({
      time,
      available: Math.random() > 0.3, // 70% available
      booked: Math.random() > 0.7 ? `Client ${tIdx + 1}` : undefined,
    }));
  });
  
  return slots;
};

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const weekSlots = generateWeekSlots(currentWeek);

  const weekStart = new Date(currentWeek);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday

  const formatWeekRange = () => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 4);
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const navigateWeek = (direction: number) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  const handleSlotClick = (dateKey: string, time: string, available: boolean, booked?: string) => {
    if (booked) {
      toast.info(`Booked with ${booked}`);
      return;
    }
    if (!available) {
      toast.error('Slot not available');
      return;
    }
    setSelectedSlot({ date: dateKey, time });
    toast.success(`Selected ${time} on ${new Date(dateKey).toLocaleDateString()}. Ready to book?`, {
      action: {
        label: 'Confirm Booking',
        onClick: () => confirmBooking(dateKey, time),
      },
    });
  };

  const confirmBooking = (dateKey: string, time: string) => {
    toast.success(`Booking confirmed for ${time} on ${new Date(dateKey).toLocaleDateString()}! (Demo)`);
    setSelectedSlot(null);
    // In real: POST to /api/bookings
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-[var(--primary)]" />
            Schedule
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Weekly availability & bookings. Powered by COSS UI.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/schedulings/booking-links" 
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Booking
          </Link>
          <Link 
            href="/admin/schedulings/availability" 
            className="btn btn-secondary flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Manage Availability
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between card p-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentWeek(new Date())} className="btn btn-secondary text-sm">Today</button>
          <div className="flex items-center gap-1">
            <button onClick={() => navigateWeek(-1)} className="btn btn-secondary p-2"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => navigateWeek(1)} className="btn btn-secondary p-2"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="font-medium text-lg">{formatWeekRange()}</div>
        </div>
        <div className="text-xs text-[var(--muted-foreground)]">Week view • Click available slots to book</div>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-6 border-b">
          {/* Time column header */}
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
          {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((time, tIdx) => (
            <div key={tIdx} className="grid grid-cols-6 hover:bg-[var(--muted)]/50 transition-colors">
              {/* Time label */}
              <div className="p-4 text-sm font-mono text-[var(--muted-foreground)] border-r flex items-center">
                <Clock className="w-3 h-3 mr-2" />{time}
              </div>

              {/* Day columns */}
              {Object.keys(weekSlots).slice(0, 5).map((dateKey, dIdx) => {
                const slot = weekSlots[dateKey][tIdx];
                const isBooked = !!slot.booked;
                const isAvailable = slot.available && !isBooked;
                
                return (
                  <div 
                    key={dIdx}
                    onClick={() => handleSlotClick(dateKey, time, slot.available, slot.booked)}
                    className={`p-3 border-r last:border-r-0 min-h-[52px] flex items-center justify-center cursor-pointer transition-all
                      ${isBooked ? 'bg-[var(--muted)] text-[var(--muted-foreground)]' : ''}
                      ${isAvailable ? 'hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]' : 'opacity-60'}
                    `}
                  >
                    {isBooked ? (
                      <div className="text-center">
                        <div className="text-xs font-medium">{slot.booked}</div>
                        <div className="text-[10px] text-[var(--muted-foreground)]">Booked</div>
                      </div>
                    ) : isAvailable ? (
                      <div className="text-xs font-medium text-[var(--primary)]">Available</div>
                    ) : (
                      <div className="text-xs text-[var(--muted-foreground)]">Unavailable</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Help */}
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[var(--primary-soft)]"></div> Available</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[var(--muted)]"></div> Booked / Unavailable</div>
        </div>
        <div>Click any green slot to book instantly. Real-time sync with AgentMemory.</div>
      </div>

      <div className="text-xs text-[var(--muted-foreground)] pt-4 border-t">
        This calendar uses COSS UI tokens and primitives. In production it will connect to /api/schedulings and Agent availability engine.
      </div>
    </div>
  );
}
