import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Journal Entries"
      description="GL journal entries (manual + automated)."
      group="Accounting"
      source="app/Filament/Resources/JournalEntryResource.php"
    />
  );
}
