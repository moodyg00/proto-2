import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Operations Dashboard"
      description="Operational health, dispatch, and queue overview."
      group="Operations"
      source="app/Filament/Pages/OperationsDashboard.php"
    />
  );
}
