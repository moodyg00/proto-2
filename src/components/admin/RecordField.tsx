'use client';

import * as React from 'react';
import { Check, Pencil, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldItem, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type RecordFieldProps = {
  label: string;
  value: string;
  onCommit?: (nextValue: string) => Promise<void> | void;
  readOnly?: boolean;
  placeholder?: string;
};

export function RecordField({
  label,
  value,
  onCommit,
  readOnly = false,
  placeholder,
}: RecordFieldProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isEditing) {
      setDraft(value);
    }
  }, [value, isEditing]);

  const canEdit = !readOnly && Boolean(onCommit);

  async function save() {
    if (!onCommit) return;
    const nextValue = draft.trim();
    const currentValue = value.trim();

    if (nextValue === currentValue) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onCommit(nextValue);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  function cancel() {
    setDraft(value);
    setIsEditing(false);
  }

  return (
    <Field className="rounded-xl border p-3">
      <FieldLabel className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</FieldLabel>

      {isEditing ? (
        <div className="space-y-2 w-full">
          <FieldItem className="w-full">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={placeholder}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void save();
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  cancel();
                }
              }}
              autoFocus
            />
          </FieldItem>
          <div className="flex items-center gap-2">
            <Button size="xs" onClick={() => void save()} loading={isSaving}>
              <Check className="size-3.5" /> Save
            </Button>
            <Button size="xs" variant="outline" onClick={cancel} disabled={isSaving}>
              <X className="size-3.5" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3 w-full">
          <div className="min-h-8 flex items-center rounded-lg border border-input bg-background px-3 text-sm leading-5 w-full">
            {value || '—'}
          </div>
          {canEdit ? (
            <Button size="xs" variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="size-3.5" /> Edit
            </Button>
          ) : null}
        </div>
      )}
    </Field>
  );
}
