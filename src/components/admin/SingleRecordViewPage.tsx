import Link from 'next/link';

type FlatField = {
  path: string;
  value: string;
};

function formatPrimitive(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function flattenFields(value: unknown, prefix = ''): FlatField[] {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [{ path: prefix || 'value', value: '[]' }];
    }

    return value.flatMap((entry, index) => flattenFields(entry, `${prefix}[${index}]`));
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return [{ path: prefix || 'value', value: '{}' }];
    }

    return entries.flatMap(([key, entry]) => {
      const nextPath = prefix ? `${prefix}.${key}` : key;
      return flattenFields(entry, nextPath);
    });
  }

  return [{ path: prefix || 'value', value: formatPrimitive(value) }];
}

export function SingleRecordViewPage({
  sectionTitle,
  recordTitle,
  recordId,
  record,
  backHref,
}: {
  sectionTitle: string;
  recordTitle: string;
  recordId: string;
  record: Record<string, unknown>;
  backHref: string;
}) {
  const fields = flattenFields(record);

  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]" style={{ borderColor: 'color-mix(in srgb, var(--border) 72%, #111111 28%)', background: 'color-mix(in srgb, var(--card) 84%, #f3efe7 16%)', color: 'var(--muted-foreground)' }}>
          {sectionTitle}
        </div>
        <Link href={backHref} className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          Back to records
        </Link>
      </header>

      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'Iowan Old Style, Georgia, serif' }}>{recordTitle}</h1>
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          Record ID: {recordId}
        </div>
      </section>

      <section className="space-y-3">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          Schema Fields
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border" style={{ borderColor: 'var(--border)' }}>
          <table className="table">
            <thead>
              <tr>
                <th className="w-1/3">Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.path}>
                  <td className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{field.path}</td>
                  <td className="text-sm">{field.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
