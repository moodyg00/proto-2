import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="AI Dashboard"
      description="Agent activity, queue depth, recent runs."
      group="AI Tools"
      source="app/Filament/Pages/AiDashboard.php"
    />
  );
}
