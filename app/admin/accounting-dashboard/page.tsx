import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Accounting Dashboard"
      description="Cash, A/R, A/P, and trial balance snapshot."
      group="Accounting"
      source="app/Filament/Pages/AccountingDashboard.php"
    />
  );
}
