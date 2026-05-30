'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  Link2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
type OverlayId = 'travel' | 'focus' | 'lunch' | 'aftercare';
type ReminderId = 'sms-24h' | 'sms-2h' | 'call-now';

type DayWindow = {
  day: DayId;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
};

type Preset = {
  id: string;
  name: string;
  note: string;
  accent: string;
  windows: DayWindow[];
};

type Overlay = {
  id: OverlayId;
  name: string;
  description: string;
  accent: string;
  windows: Array<{ day: DayId; start: string; end: string }>;
};

type Reminder = {
  id: ReminderId;
  label: string;
  description: string;
  channel: string;
};

type BookingLink = {
  id: string;
  name: string;
  slug: string;
  duration: string;
  channel: string;
  profile: string;
  reminders: string[];
  overlay: string;
  intake: string[];
};

type Booking = {
  id: string;
  day: DayId;
  start: string;
  title: string;
  type: string;
};

const WEEK_DAYS: Array<{ id: DayId; label: string; short: string }> = [
  { id: 'mon', label: 'Monday', short: 'Mon' },
  { id: 'tue', label: 'Tuesday', short: 'Tue' },
  { id: 'wed', label: 'Wednesday', short: 'Wed' },
  { id: 'thu', label: 'Thursday', short: 'Thu' },
  { id: 'fri', label: 'Friday', short: 'Fri' },
  { id: 'sat', label: 'Saturday', short: 'Sat' },
  { id: 'sun', label: 'Sunday', short: 'Sun' },
];

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const PRESETS: Preset[] = [
  {
    id: 'studio',
    name: 'Studio Default',
    note: 'Balanced weekdays with afternoon buffer protection.',
    accent: '#111111',
    windows: [
      { day: 'mon', label: 'Mon', enabled: true, start: '09:00', end: '17:00' },
      { day: 'tue', label: 'Tue', enabled: true, start: '09:00', end: '17:00' },
      { day: 'wed', label: 'Wed', enabled: true, start: '10:00', end: '17:00' },
      { day: 'thu', label: 'Thu', enabled: true, start: '09:00', end: '16:00' },
      { day: 'fri', label: 'Fri', enabled: true, start: '09:00', end: '14:00' },
      { day: 'sat', label: 'Sat', enabled: false, start: '10:00', end: '12:00' },
      { day: 'sun', label: 'Sun', enabled: false, start: '10:00', end: '12:00' },
    ],
  },
  {
    id: 'dispatch',
    name: 'Dispatch Window',
    note: 'Extended mornings for field coordination and call-backs.',
    accent: '#0f766e',
    windows: [
      { day: 'mon', label: 'Mon', enabled: true, start: '08:00', end: '17:00' },
      { day: 'tue', label: 'Tue', enabled: true, start: '08:00', end: '17:00' },
      { day: 'wed', label: 'Wed', enabled: true, start: '08:00', end: '16:00' },
      { day: 'thu', label: 'Thu', enabled: true, start: '08:00', end: '16:00' },
      { day: 'fri', label: 'Fri', enabled: true, start: '08:00', end: '13:00' },
      { day: 'sat', label: 'Sat', enabled: false, start: '10:00', end: '12:00' },
      { day: 'sun', label: 'Sun', enabled: false, start: '10:00', end: '12:00' },
    ],
  },
  {
    id: 'afterhours',
    name: 'After-Hours Hotline',
    note: 'Short emergency windows for nights and weekends.',
    accent: '#7c2d12',
    windows: [
      { day: 'mon', label: 'Mon', enabled: true, start: '16:00', end: '18:00' },
      { day: 'tue', label: 'Tue', enabled: true, start: '16:00', end: '18:00' },
      { day: 'wed', label: 'Wed', enabled: true, start: '16:00', end: '18:00' },
      { day: 'thu', label: 'Thu', enabled: true, start: '16:00', end: '18:00' },
      { day: 'fri', label: 'Fri', enabled: true, start: '15:00', end: '17:00' },
      { day: 'sat', label: 'Sat', enabled: true, start: '10:00', end: '13:00' },
      { day: 'sun', label: 'Sun', enabled: false, start: '10:00', end: '12:00' },
    ],
  },
];

const OVERLAYS: Overlay[] = [
  {
    id: 'travel',
    name: 'Travel Buffer',
    description: 'Shields half-hour blocks around field calls.',
    accent: '#0f766e',
    windows: [
      { day: 'tue', start: '12:00', end: '13:00' },
      { day: 'thu', start: '11:00', end: '12:00' },
    ],
  },
  {
    id: 'focus',
    name: 'Deep Work',
    description: 'No-book zones for proposal building and review.',
    accent: '#4338ca',
    windows: [
      { day: 'wed', start: '13:00', end: '16:00' },
    ],
  },
  {
    id: 'lunch',
    name: 'Lunch Hold',
    description: 'Protected midday pause that still feels human.',
    accent: '#b45309',
    windows: [
      { day: 'mon', start: '12:00', end: '13:00' },
      { day: 'tue', start: '12:00', end: '13:00' },
      { day: 'thu', start: '12:00', end: '13:00' },
      { day: 'fri', start: '12:00', end: '13:00' },
    ],
  },
  {
    id: 'aftercare',
    name: 'Aftercare Calls',
    description: 'Short follow-up corridor after completed jobs.',
    accent: '#be185d',
    windows: [
      { day: 'mon', start: '16:00', end: '17:00' },
      { day: 'fri', start: '10:00', end: '12:00' },
    ],
  },
];

const REMINDERS: Reminder[] = [
  {
    id: 'sms-24h',
    label: '24 hour SMS',
    description: 'Confirms time, address, and crew notes the day before.',
    channel: 'SMS',
  },
  {
    id: 'sms-2h',
    label: '2 hour reminder',
    description: 'Sends live ETA framing and prep checklist before arrival.',
    channel: 'SMS',
  },
  {
    id: 'call-now',
    label: 'Missed-booking rescue',
    description: 'Text thread escalates to call prompt if the invite is ignored.',
    channel: 'Automation',
  },
];

const BOOKING_LINKS: BookingLink[] = [
  {
    id: 'consult',
    name: 'On-site Consult',
    slug: 'proto-2/consult',
    duration: '45 min',
    channel: 'Phone or on-site',
    profile: 'Dispatch Window',
    reminders: ['24 hour SMS', '2 hour reminder'],
    overlay: 'Travel Buffer',
    intake: ['Address', 'Project type', 'Photo upload'],
  },
  {
    id: 'callback',
    name: 'Lead Callback',
    slug: 'proto-2/callback',
    duration: '15 min',
    channel: 'Phone',
    profile: 'Studio Default',
    reminders: ['2 hour reminder'],
    overlay: 'Aftercare Calls',
    intake: ['Phone', 'Source', 'Urgency'],
  },
  {
    id: 'review',
    name: 'Project Review',
    slug: 'proto-2/review',
    duration: '30 min',
    channel: 'Video',
    profile: 'Studio Default',
    reminders: ['24 hour SMS'],
    overlay: 'Deep Work',
    intake: ['Project ID', 'Open questions'],
  },
];

const BOOKINGS: Booking[] = [
  { id: 'b1', day: 'mon', start: '09:00', title: 'Northside estimate', type: 'On-site consult' },
  { id: 'b2', day: 'tue', start: '10:00', title: 'Warranty callback', type: 'Phone' },
  { id: 'b3', day: 'thu', start: '14:00', title: 'Commercial review', type: 'Video' },
  { id: 'b4', day: 'fri', start: '11:00', title: 'VIP client hold', type: 'Priority' },
];

const TIME_OPTIONS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function timeLabel(time: string) {
  const [rawHour, rawMinute] = time.split(':').map(Number);
  const suffix = rawHour >= 12 ? 'pm' : 'am';
  const hour = rawHour % 12 || 12;
  return `${hour}:${String(rawMinute).padStart(2, '0')} ${suffix}`;
}

function isTimeWithin(time: string, start: string, end: string) {
  return time >= start && time < end;
}

function startOfWeek(offset: number) {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatWeekLabel(offset: number) {
  const weekStart = startOfWeek(offset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);
  return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

function weekDates(offset: number) {
  const monday = startOfWeek(offset);
  return WEEK_DAYS.slice(0, 5).map((day, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);
    return { ...day, date: current };
  });
}

function monthFirstDate(offset: number) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offset, 1);
}

function formatMonthLabel(offset: number) {
  return monthFirstDate(offset).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function monthGridDates(offset: number) {
  const first = monthFirstDate(offset);
  const startDayIndex = (first.getDay() + 6) % 7; // Monday-based index
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startDayIndex);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]"
      style={{
        borderColor: 'color-mix(in srgb, var(--border) 72%, #111 28%)',
        background: 'color-mix(in srgb, var(--card) 84%, #f3efe7 16%)',
        color: 'var(--muted-foreground)',
      }}
    >
      {children}
    </div>
  );
}

function InlineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
      <span className="uppercase tracking-[0.18em]">{label}</span>
      <span className="font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function TogglePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
      style={{
        borderColor: active ? '#111111' : 'var(--border)',
        background: active ? '#111111' : 'var(--card)',
        color: active ? '#ffffff' : 'var(--foreground)',
      }}
    >
      {label}
    </button>
  );
}

function ToggleRow({
  active,
  label,
  description,
  onToggle,
  meta,
}: {
  active: boolean;
  label: string;
  description: string;
  onToggle: () => void;
  meta?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-4 rounded-[1.4rem] border px-4 py-4 text-left transition-transform hover:-translate-y-0.5"
      style={{
        borderColor: active ? '#111111' : 'var(--border)',
        background: active ? 'color-mix(in srgb, #111111 5%, var(--card) 95%)' : 'var(--card)',
      }}
    >
      <div className="space-y-1">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{description}</div>
        {meta ? <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>{meta}</div> : null}
      </div>
      <div
        className="mt-0.5 flex h-7 w-12 items-center rounded-full border px-1 transition-colors"
        style={{
          borderColor: active ? '#111111' : 'var(--border)',
          background: active ? '#111111' : 'var(--muted)',
        }}
      >
        <div
          className="h-5 w-5 rounded-full transition-transform"
          style={{
            transform: active ? 'translateX(18px)' : 'translateX(0)',
            background: active ? '#f7f2e8' : '#ffffff',
          }}
        />
      </div>
    </button>
  );
}

function CalendarGrid({
  preset,
  activeOverlays,
  weekOffset,
}: {
  preset: Preset;
  activeOverlays: Overlay[];
  weekOffset: number;
}) {
  const days = useMemo(() => weekDates(weekOffset), [weekOffset]);

  return (
    <div className="overflow-hidden rounded-[2rem] border" style={{ borderColor: 'color-mix(in srgb, var(--border) 80%, transparent 20%)' }}>
      <div className="grid grid-cols-[78px_repeat(5,minmax(0,1fr))] border-b bg-[color-mix(in_srgb,var(--card)_88%,#f3efe7_12%)]">
        <div className="px-4 py-4 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>Time</div>
        {days.map((day) => (
          <div key={day.id} className="border-l px-4 py-4" style={{ borderColor: 'var(--border)' }}>
            <div className="text-sm font-semibold">{day.short}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>

      {TIME_SLOTS.map((time) => (
        <div key={time} className="grid grid-cols-[78px_repeat(5,minmax(0,1fr))] border-b last:border-b-0" style={{ borderColor: 'color-mix(in srgb, var(--border) 80%, transparent 20%)' }}>
          <div className="flex items-start px-4 py-3 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            {timeLabel(time)}
          </div>
          {days.map((day) => {
            const windowForDay = preset.windows.find((entry) => entry.day === day.id);
            const available = Boolean(windowForDay?.enabled && isTimeWithin(time, windowForDay.start, windowForDay.end));
            const booking = BOOKINGS.find((entry) => entry.day === day.id && entry.start === time);
            const overlay = activeOverlays.find((entry) => entry.windows.some((window) => window.day === day.id && isTimeWithin(time, window.start, window.end)));

            return (
              <div
                key={`${day.id}-${time}`}
                className="border-l px-2 py-2"
                style={{ borderColor: 'color-mix(in srgb, var(--border) 80%, transparent 20%)' }}
              >
                <div
                  className="min-h-[62px] rounded-[1.3rem] border px-3 py-2 transition-transform hover:-translate-y-0.5"
                  style={{
                    borderColor: booking ? '#111111' : overlay ? overlay.accent : available ? 'color-mix(in srgb, #111111 18%, var(--border) 82%)' : 'transparent',
                    background: booking
                      ? '#111111'
                      : overlay
                        ? `color-mix(in srgb, ${overlay.accent} 16%, var(--card) 84%)`
                        : available
                          ? 'color-mix(in srgb, var(--card) 92%, #f3efe7 8%)'
                          : 'transparent',
                    color: booking ? '#ffffff' : 'var(--foreground)',
                  }}
                >
                  {booking ? (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{booking.type}</div>
                      <div className="text-sm font-semibold">{booking.title}</div>
                      <div className="text-[11px] text-white/70">SMS reminder armed</div>
                    </div>
                  ) : overlay ? (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: overlay.accent }}>Overlay</div>
                      <div className="text-sm font-medium">{overlay.name}</div>
                    </div>
                  ) : available ? (
                    <div className="flex h-full items-end justify-between">
                      <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>Open</div>
                      <Plus className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                  ) : (
                    <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>Offline</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function BookingLinksSummary() {
  return (
    <div className="space-y-3">
      {BOOKING_LINKS.map((link) => (
        <div
          key={link.id}
          className="rounded-[1.35rem] border px-4 py-4"
          style={{
            borderColor: 'color-mix(in srgb, var(--border) 82%, transparent 18%)',
            background: 'color-mix(in srgb, var(--card) 90%, #f3efe7 10%)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">{link.name}</div>
              <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{link.duration} • {link.channel}</div>
            </div>
            <div className="rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              {link.profile}
            </div>
          </div>
          <div className="mt-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>/{link.slug}</div>
        </div>
      ))}
    </div>
  );
}

export function SchedulingStudio() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [monthOffset, setMonthOffset] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const monthDates = useMemo(() => monthGridDates(monthOffset), [monthOffset]);
  const activeMonthDate = monthFirstDate(monthOffset);
  const today = new Date();

  return (
    <div className="space-y-6 pb-6">
      <header className="flex items-center">
        <SectionEyebrow>
          <CalendarDays className="h-3.5 w-3.5" />
          Scheduling Studio
        </SectionEyebrow>
      </header>

      <Card className="overflow-hidden rounded-2xl border-0">
        <CardContent className="p-6">
          <Tabs defaultValue="month" className="gap-4">
            <div className="flex items-center gap-3">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="month" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                  <Button variant="outline" size="icon-sm" onClick={() => setMonthOffset((value) => value - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-lg font-semibold tracking-tight">{formatMonthLabel(monthOffset)}</div>
                  <Button variant="outline" size="icon-sm" onClick={() => setMonthOffset((value) => value + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--border)' }}>
                    {WEEK_DAYS.map((day) => (
                      <div
                        key={day.id}
                        className="py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em]"
                        style={{ color: 'var(--muted-foreground)', background: 'color-mix(in srgb, var(--card) 90%, #f3efe7 10%)' }}
                      >
                        {day.short}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {monthDates.map((date) => {
                      const isCurrentMonth = date.getMonth() === activeMonthDate.getMonth();
                      const isSelected = isSameDate(date, selectedDate);
                      const isToday = isSameDate(date, today);

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className="h-24 border-r border-b p-2 text-left transition-colors last:border-r-0"
                          style={{
                            borderColor: 'var(--border)',
                            background: isSelected ? 'color-mix(in srgb, var(--foreground) 10%, var(--card) 90%)' : 'var(--card)',
                            color: isCurrentMonth ? 'var(--foreground)' : 'var(--muted-foreground)',
                          }}
                        >
                          <span
                            className="inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-sm font-medium tabular-nums"
                            style={{
                              background: isSelected ? 'var(--foreground)' : isToday ? 'color-mix(in srgb, var(--foreground) 12%, transparent)' : 'transparent',
                              color: isSelected ? 'var(--background)' : 'inherit',
                            }}
                          >
                            {date.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="week" className="mt-0 space-y-4">
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="icon-sm" onClick={() => setWeekOffset((value) => value - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-36 text-center text-sm font-medium">{formatWeekLabel(weekOffset)}</div>
                <Button variant="outline" size="icon-sm" onClick={() => setWeekOffset((value) => value + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <CalendarGrid preset={PRESETS[0]} activeOverlays={[]} weekOffset={weekOffset} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export function AvailabilityStudio() {
  const [selectedPresetId, setSelectedPresetId] = useState(PRESETS[0].id);
  const [windows, setWindows] = useState<DayWindow[]>(PRESETS[0].windows);
  const [activeOverlayIds, setActiveOverlayIds] = useState<OverlayId[]>(['travel', 'lunch']);

  const selectedPreset = PRESETS.find((preset) => preset.id === selectedPresetId) ?? PRESETS[0];

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((entry) => entry.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setWindows(preset.windows);
  };

  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <SectionEyebrow>
          <Clock3 className="h-3.5 w-3.5" />
          Availability Designer
        </SectionEyebrow>
        <InlineMetric label="Profile" value={selectedPreset.name} />
      </header>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <SectionEyebrow>
            <Clock3 className="h-3.5 w-3.5" />
            Profile selector
          </SectionEyebrow>
          {PRESETS.map((preset) => (
            <TogglePill
              key={preset.id}
              active={selectedPreset.id === preset.id}
              label={preset.name}
              onClick={() => applyPreset(preset.id)}
            />
          ))}
          <InlineMetric label="Timezone" value="America/Chicago" />
          <InlineMetric label="Buffer" value="15m before / 30m after" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SectionEyebrow>
            <Link2 className="h-3.5 w-3.5" />
            Overlay controls
          </SectionEyebrow>
          {OVERLAYS.map((overlay) => (
            <TogglePill
              key={overlay.id}
              active={activeOverlayIds.includes(overlay.id)}
              label={overlay.name}
              onClick={() => {
                setActiveOverlayIds((current) =>
                  current.includes(overlay.id)
                    ? current.filter((id) => id !== overlay.id)
                    : [...current, overlay.id]
                );
              }}
            />
          ))}
        </div>

        <Card className="rounded-[2rem] border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl" style={{ fontFamily: 'Iowan Old Style, Georgia, serif' }}>Weekly hours</CardTitle>
            <CardDescription>Availability selector with inline edit controls and overlay visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {windows.map((window, index) => (
              <div
                key={window.day}
                className="grid gap-3 rounded-[1.5rem] border px-4 py-4 md:grid-cols-[110px_88px_1fr_1fr_auto] md:items-center"
                style={{
                  borderColor: window.enabled ? '#111111' : 'var(--border)',
                  background: window.enabled ? 'color-mix(in srgb, #111111 3%, var(--card) 97%)' : 'var(--card)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setWindows((current) =>
                      current.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, enabled: !entry.enabled } : entry
                      )
                    );
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-7 w-12 items-center rounded-full border px-1" style={{ borderColor: window.enabled ? '#111111' : 'var(--border)', background: window.enabled ? '#111111' : 'var(--muted)' }}>
                    <div className="h-5 w-5 rounded-full bg-white transition-transform" style={{ transform: window.enabled ? 'translateX(18px)' : 'translateX(0)' }} />
                  </div>
                  <span className="text-sm font-semibold">{window.label}</span>
                </button>

                <div className="rounded-full border px-3 py-1 text-center text-[11px] uppercase tracking-[0.16em]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  {window.enabled ? 'Live' : 'Off'}
                </div>

                <select
                  value={window.start}
                  onChange={(event) => {
                    const next = event.target.value;
                    setWindows((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, start: next } : entry));
                  }}
                  className="h-11 rounded-[1rem] border px-3 text-sm outline-none"
                  style={{ borderColor: 'var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                >
                  {TIME_OPTIONS.map((time) => <option key={time} value={time}>{timeLabel(time)}</option>)}
                </select>

                <select
                  value={window.end}
                  onChange={(event) => {
                    const next = event.target.value;
                    setWindows((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, end: next } : entry));
                  }}
                  className="h-11 rounded-[1rem] border px-3 text-sm outline-none"
                  style={{ borderColor: 'var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                >
                  {TIME_OPTIONS.map((time) => <option key={time} value={time}>{timeLabel(time)}</option>)}
                </select>

                <div className="text-right text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {window.enabled ? `${timeLabel(window.start)} – ${timeLabel(window.end)}` : 'No availability'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export function BookingLinksStudio() {
  const [enabledIds, setEnabledIds] = useState<string[]>(BOOKING_LINKS.map((link) => link.id));
  const [smsEnabledIds, setSmsEnabledIds] = useState<string[]>(BOOKING_LINKS.map((link) => link.id));

  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <SectionEyebrow>
          <Link2 className="h-3.5 w-3.5" />
          Booking Links Studio
        </SectionEyebrow>
        <Button size="sm" onClick={() => toast.success('New booking link draft created.') }>
          <Plus className="h-4 w-4" />
          New link
        </Button>
      </header>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <SectionEyebrow>
            <Sparkles className="h-3.5 w-3.5" />
            Quick actions
          </SectionEyebrow>
          <Button variant="outline" size="sm" onClick={() => toast.success('Intake schema synced from CRM contact forms.') }>
            Sync intake
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('Reminder policy copied to all enabled links.') }>
            Apply reminders
          </Button>
          <Button size="sm" onClick={() => toast.success('Public booking layer published.') }>
            Publish layer
          </Button>
        </div>

        <div className="space-y-5">
          {BOOKING_LINKS.map((link) => {
            const enabled = enabledIds.includes(link.id);
            const smsEnabled = smsEnabledIds.includes(link.id);

            return (
              <Card key={link.id} className="rounded-[2rem] border-0 shadow-none">
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <CardTitle className="text-xl" style={{ fontFamily: 'Iowan Old Style, Georgia, serif' }}>{link.name}</CardTitle>
                      <CardDescription className="mt-2">/{link.slug} • {link.duration} • {link.channel}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.success(`Copied ${link.slug}`)}>
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast.success(`Preview opened for ${link.name}`)}>
                        <ExternalLink className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 pt-6 lg:grid-cols-[1fr_1fr]">
                  <div className="space-y-4">
                    <div className="rounded-[1.35rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--card) 92%, #f3efe7 8%)' }}>
                      <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>Availability profile</div>
                      <div className="mt-2 text-sm font-semibold">{link.profile}</div>
                      <div className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Overlay package: {link.overlay}</div>
                    </div>
                    <div className="rounded-[1.35rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--card) 92%, #f3efe7 8%)' }}>
                      <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>Intake fields</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {link.intake.map((field) => (
                          <span key={field} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border)' }}>{field}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <TogglePill
                        active={enabled}
                        label={enabled ? 'Link enabled' : 'Link disabled'}
                        onClick={() => {
                          setEnabledIds((current) => current.includes(link.id) ? current.filter((id) => id !== link.id) : [...current, link.id]);
                        }}
                      />
                      <TogglePill
                        active={smsEnabled}
                        label={smsEnabled ? 'SMS reminders on' : 'SMS reminders off'}
                        onClick={() => {
                          setSmsEnabledIds((current) => current.includes(link.id) ? current.filter((id) => id !== link.id) : [...current, link.id]);
                        }}
                      />
                    </div>
                    <div className="rounded-[1.35rem] border px-4 py-4 text-sm" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--card) 92%, #f3efe7 8%)' }}>
                      <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>Reminder automation</div>
                      <div className="mt-2" style={{ color: 'var(--muted-foreground)' }}>{link.reminders.join(' • ')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}