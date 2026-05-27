import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="CRM Dashboard"
      description="CRM activity, follow-ups, and pipeline."
      group="Customer Relations"
      source="app/Filament/Pages/CrmDashboard.php"
    />
  );
}
